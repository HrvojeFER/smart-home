#include <Arduino.h>
#include <Ethernet2.h>
#include "ethernet.h"


//-----------------------------------------------------------------

Temperature::Temperature(DHT* dht, int pin):
	sensor(dht),
	controlPin(pin),
  target(25.00)
{}

String Temperature::getName() {
	return String("Temperatura");
}

float Temperature::readValue() {
	return sensor->readTemperature();
}

bool Temperature::readControlValue() {
  digitalRead(controlPin);
}

void Temperature::changeValue() {
	digitalWrite(controlPin, !digitalRead(controlPin));
}

float Temperature::getTarget() {
  return target;
}

//-----------------------------------------------------------------

Humidity::Humidity(DHT* dht, int pin):
	sensor(dht),
	controlPin(pin),
  target(50.00)
{}

String Humidity::getName() {
	return String("Vlaga");
}

float Humidity::readValue() {
	return sensor->readHumidity();
}

bool Humidity::readControlValue() {
  digitalRead(controlPin);
}

void Humidity::changeValue() {
	digitalWrite(controlPin, !digitalRead(controlPin));
}

float Humidity::getTarget() {
  return target;
}

//-----------------------------------------------------------------

Light::Light(int sensor, int pin){
	sensorPin = sensor;
	controlPin = pin;
  target = 400;
}

String Light::getName() {
	return String("Osvjetljenje");
}

float Light::readValue() {
	return (float)analogRead(sensorPin);
}

bool Light::readControlValue() {
  digitalRead(controlPin);
}

void Light::changeValue() {
	digitalWrite(controlPin, !digitalRead(controlPin));
}

float Light::getTarget() {
  return target;
}

//-----------------------------------------------------------------
 
Room::Room(String r, Property* p[3]):
  roomName(r),
  properties(p)
{}

String Room::getName() {
      return roomName;
}

float Room::readValue(String parameter) {
  for(int i = 0; i < 3; i++) {
    if(properties[i]->getName() == parameter) {
      return properties[i]->readValue();
    }
  }
  return 0.0;
}

bool Room::readControlValue(String parameter) {
  for(int i = 0; i < 3; i++) {
    if(properties[i]->getName() == parameter) {
      return properties[i]->readControlValue();
    }
  }
  return false;
}

void Room::changeValue(String parameter) {
  for(int i = 0; i < 3; i++) {
    if(properties[i]->getName() == parameter) {
      properties[i]->changeValue();
    }
  }
}

//-----------------------------------------------------------------

RequestHandler::RequestHandler(Room *a, int num){
      rooms = a;
      numberOfRooms = num;
}

void RequestHandler::listRooms() {
      for(int i = 0; i < numberOfRooms; i++) {
        Serial.println(rooms[i].getName());
        
      }
}

String RequestHandler::extractLocation(String path) {
  String response = path.substring(1, path.indexOf('/', 1));
  if(response == -1) {
    return "";
  } else {
    return response;
  }
}

String RequestHandler::extractParameter(String path) {
  int first = path.indexOf('/', 1);
  if (first == -1) {
    return "";
  }
  String response;
  int second = path.indexOf('/', first + 1);
  if(second == -1) {
	  response = path.substring(first + 1);
  } else {
	  response = path.substring(first + 1, second);
  }
  if(response == -1) {
    return "";
  } else {
    return response;
  }
}

String RequestHandler::extractType(String path) {
  int first = path.indexOf('/', 1);
  if (first == -1) {
    return "";
  }
  int second = path.indexOf('/', first + 1);
  if (second == -1) {
    return "";
  }
  String response;
  int third = path.indexOf('/', second + 1);
  if(third == -1) {
	  response = path.substring(second + 1);
  } else {
	  response = path.substring(second + 1, third);
  }
  if(response == -1) {
    return "";
  } else {
    return response;
  }
}

bool RequestHandler::requestValid(String method, String location, String parameter, String type) {
  bool methodStatus = (method == "GET" || method == "POST"); 
  bool locationStatus = false, parameterStatus = false, typeStatus = false;
  String parameters[] = {"Temperatura", "Vlaga", "Osvjetljenje"};
  
  
  if((location == "conf" || location == "conf/") && parameter == "" && type == "") {
    locationStatus = true;
    parameterStatus = true;
    typeStatus = true;
  } else {
    for(int i = 0; i < numberOfRooms; i++) {
      if(rooms[i].getName() == location) {
        locationStatus = true;
        break;
      }
    }
  
    for(int i = 0; i < 3; i++) {
      if(parameters[i] == parameter) {
        parameterStatus = true;
        break;
      }
    }

    typeStatus = (type == "Controller" || type == "Sensor");
  }

  return methodStatus && locationStatus && parameterStatus && typeStatus;
}

float RequestHandler::readParameter(String location, String parameter) {
  for(int i = 0; i < numberOfRooms; i++) {
    if(rooms[i].getName() == location) {
      return rooms[i].readValue(parameter);
    }
  }
  return 0.0;
}

bool RequestHandler::readController(String location, String parameter) {
  for(int i = 0; i < numberOfRooms; i++) {
    if(rooms[i].getName() == location) {
      return rooms[i].readControlValue(parameter);
    }
  }
  return 0.0;
}

void RequestHandler::changeControllerStatus(String location, String parameter) {
  for(int i = 0; i < numberOfRooms; i++) {
    if(rooms[i].getName() == location) {
      rooms[i].changeValue(parameter);
    }
  }
}

String RequestHandler::confResponse() {
  String response;
  response.concat("{\n");

  for(int i = 0; i < numberOfRooms; i++) {
    response.concat("\"" + rooms[i].getName() + "\": ");
    response.concat(" [\n");

    for(int j = 0; j < 3; j++) {
      response.concat("   {\n");
      response.concat("     \"property\": \"" + rooms[i].properties[j]->getName() + "\",\n");
      response.concat("     \"value\": \"" + (String) rooms[i].properties[j]->readValue() + "\",\n");
      response.concat("     \"target\": \"" + (String) rooms[i].properties[j]->getTarget() + "\"\n");
      response.concat("   }");
      if(j < 2) {
        response.concat(",\n");
      } else {
        response.concat("\n");
      }
      delay(100);
    }
    
    response.concat(" ]\n");
    if(i < numberOfRooms-1) {
      response.concat(",");
    }
  }
  
  response.concat("}\n");
  return response;
}

String RequestHandler::handleRequest(String method, String path) {
  String response;
  String location = this->extractLocation(path);
  String parameter = this->extractParameter(path);
  String type = this->extractType(path);
  
  Serial.println("\nExtractions: " + location + " " + parameter + " " + type);

  if(this->requestValid(method, location, parameter, type)) {
    response.concat("HTTP/1.1 200 OK\n");
    response.concat("Access-Control-Allow-Origin: *\n");
    response.concat("Content-Type: text/plain\n\n");
    if (method == "GET") {
      if(location == "conf" || location == "conf/") {
        response.concat(this->confResponse());
      } else { 
        if (type == "Sensor") {
          response.concat("{ \"status\": ");
          response.concat(this->readParameter(location, parameter));
          response.concat(" }");
        } else if (type == "Controller") {
          response.concat("{ \"status\": ");
          response.concat(this->readController(location, parameter) ? "true" : "false");
          response.concat(" }");
        }
      }
    } else if (method == "POST") {
      if (type == "Controller") {
        this->changeControllerStatus(location, parameter);
        response.concat("{ \"status\": ");
        response.concat(this->readController(location, parameter) ? "true" : "false");
        response.concat(" }");
      }
    }
  } else {
    response.concat("HTTP/1.1 400 Bad Request\n");
  }
  return response;
}
