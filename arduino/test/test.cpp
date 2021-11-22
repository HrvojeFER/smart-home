#include <Arduino.h>
#include "test.h"


//-----------------------------------------------------------------

Temperature::Temperature(DHT* dht, int pin):
	sensor(dht),
	controlPin(pin),
  target(25.00)
{}

String Temperature::getName() {
	return String("temperature");
}

float Temperature::readValue() {
	return sensor->readTemperature();
}

void Temperature::setValue(float value) {
	if(value >= 0.5) {
		digitalWrite(controlPin, HIGH);
	} else {
		digitalWrite(controlPin, LOW);
	}
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
	return String("humidity");
}

float Humidity::readValue() {
	return sensor->readHumidity();
}

void Humidity::setValue(float value) {
	if(value >= 0.5) {
		digitalWrite(controlPin, HIGH);
	} else {
		digitalWrite(controlPin, LOW);
	}
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
	return String("light");
}

float Light::readValue() {
	return (float)analogRead(sensorPin);
}

void Light::setValue(float value) {
	if(value >= 0.5) {
		digitalWrite(controlPin, HIGH);
	} else {
		digitalWrite(controlPin, LOW);
	}
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
  int i = path.indexOf('/', 1) + 1;
  String response;
  if(path.indexOf('/', i) == -1) {
	  response = path.substring(i, path.length());
  } else {
	response = path.substring(i, path.indexOf('/', i));
  }
  if(response == -1) {
    return "";
  } else {
    return response;
  }
}

bool RequestHandler::requestValid(String method, String location, String parameter) {
  bool methodStatus = (method == "GET" || method == "POST"); 
  bool locationStatus = false, parameterStatus = false;
  String parameters[] = {"temperature", "humidity", "light"};
  
  
  if((location == "conf" || location == "conf/") && parameter == "") {
    locationStatus = true;
    parameterStatus = true;
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
  }
  return methodStatus && locationStatus && parameterStatus;
}

float RequestHandler::readParameter(String location, String parameter) {
  for(int i = 0; i < numberOfRooms; i++) {
    if(rooms[i].getName() == location) {
      return rooms[i].readValue(parameter);
    }
  }
  return 0.0;
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
      response.concat("   }\n");
      if(j < 2) {
        response.concat(",");
      }
    }
    
    response.concat(" ]");
    if(i < numberOfRooms-1) {
      response.concat(",");
    }
    response.concat("\n");
  }
  
  response.concat("}\n");
  return response;
}

String RequestHandler::handleRequest(String method, String path) {
  String location = this->extractLocation(path);
  String parameter = this->extractParameter(path);
  String response;
  if(this->requestValid(method, location, parameter)) {
    response.concat("HTTP/1.1 200 OK\n");
    response.concat("Content-Type: application/json\n");
    response.concat("Connection: close\n\n");
    if(location == "conf" || location == "conf/") {
      response.concat(this->confResponse());
    } else {
      if(method == "POST") {
          //u rooms nades sobu po imenu
          // nades parametar koji je trazes
          
      } else {
        response.concat("{\"" + parameter + "\": \"");
        response.concat(this->readParameter(location, parameter));
        response.concat("\"}");
      }
    }
  } else {
    response.concat("HTTP/1.1 400 Bad Request\n");
  }
  return response;
}
