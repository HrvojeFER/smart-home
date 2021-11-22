#ifndef smarthome_h
#define smarthome_h


#include "Arduino.h"
#include "DHT.h"
#include <Ethernet2.h>


class Property {
  public:
    virtual String getName() = 0;
    virtual float readValue() = 0;
    virtual bool readControlValue() = 0;
    virtual void changeValue();
    virtual float getTarget() = 0;
};

//--------------------------------------------------------

class Room {
  private:
    String roomName;

  public:
    Room(String r, Property** p);
	
    String getName();

    bool readControlValue(String parameter);
    float readValue(String parameter);
    void changeValue(String parameter);

    Property** properties;
};

//-----------------------------------------------------------------

class Temperature : public Property {
  private:
		DHT* sensor;
		int controlPin;
    float target;
	
	public:
		Temperature(DHT* dht, int pin);
	
    String getName();
    float readValue();
    bool readControlValue();
		void changeValue();
    float getTarget();
    
};

//-----------------------------------------------------------------

class Humidity : public Property {
  private:
		DHT* sensor;
		int controlPin;
    float target;
	
	public:
		Humidity(DHT* dht, int pin);
	
    String getName();
    float readValue();
    bool readControlValue();
		void changeValue();
    float getTarget();
};

//-----------------------------------------------------------------

class Light : public Property {
	private:
		int sensorPin;
		int controlPin;
    int target;
		
		
	public:
		Light(int sensor, int pin);
	
		String getName();
		float readValue();
    bool readControlValue();
		void changeValue();
    float getTarget();
};

//-----------------------------------------------------------------

class RequestHandler {
  public:
    Room* rooms;
    int numberOfRooms;

    bool requestValid(String method, String location, String parameter, String type);

    String extractLocation(String path);

    String extractParameter(String path);

    String extractType(String path);

    float readParameter(String location, String parameter);

    bool readController(String location, String parameter);

    void changeControllerStatus(String location, String parameter);

    String confResponse();

    

    RequestHandler(Room *a, int num);
    
    String handleRequest(String method, String path);

    void listRooms();
};


#endif
