#include <DHT.h>
#include "test.h"


#define DHTPIN 2
#define DHTTYPE DHT21


DHT dht(DHTPIN, DHTTYPE);

Temperature temperature = Temperature(&dht, 6);
Humidity humidity = Humidity(&dht, 5);
Light light = Light(6, 36);

Property* properties[] = {&temperature, &humidity, &light};

Room kuhinja = Room(String("kuhinja"), properties);
Room kupaona = Room(String("kupaona"), properties);
Room dnevniBoravak = Room(String("dnevni-boravak"), properties);

Room arr[3] = {kuhinja, kupaona, dnevniBoravak};

RequestHandler requestHandler = RequestHandler(arr, 3);

String m = "GET";
String p = "/kuhinja/temperature/";


void setup() {
  Serial.begin(9600);
  
  dht.begin();
}


void loop() {
  Serial.println(requestHandler.handleRequest(m, p));
  Serial.println();
  delay(500);
  p = "/kuhinja/humidity";
  Serial.println(requestHandler.handleRequest(m, p));
  Serial.println();
  delay(500);
  p = "/kuhinja/light";
  Serial.println(requestHandler.handleRequest(m, p));
  Serial.println();
  p = "/conf";
  Serial.println(requestHandler.handleRequest(m, p));
  Serial.println();
  p = "/kuhinja/temperature";
  
  Serial.println("------------------------------------------------------");
  delay(3000);
}
