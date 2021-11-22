#include <SPI.h>
#include <Ethernet2.h>

// There was a typo in aRest.
// ifndef this directive without the second underscore
#define ethernet_h_

#include <aREST.h>
#include <avr/wdt.h>

// MAC address for your controller
byte mac[] = { 0x90, 0xA2, 0xDA, 0x0E, 0xFE, 0x40 };

// IP address in case DHCP fails
IPAddress ip(192,168,0,150);

// Ethernet server
EthernetServer server(420);

// Create CustomRest instance
aREST rest = aREST();

// Light status to be exposed to the API
bool lightStatus;
const int pin = Q0_0;

// Declare light status changer to be exposed to the API
int changeLightStatus(String command);

void setup(void)
{
  // Start Serial
  Serial.begin(115200);
  
  // Wait for serial to connect
  while (!Serial) {
    ;
  }

  // Init light status and expose it to REST API
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
  lightStatus = true;
  rest.variable("lightStatus", &lightStatus);

  Serial.println("Lights exposed.");

  // Expose light status change function
  rest.function("changeLightStatus", changeLightStatus);
  
  Serial.println("Light change exposed.");

  // Give name & ID to the device (ID should be 6 characters long)
  rest.set_id("ardctr");
  rest.set_name("controller");

  Serial.println("REST set.");

  // Start the Ethernet connection and the server
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP.");
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
  server.begin();

  Serial.println("Ethernet set.");

  // Print IP
  Serial.print("Server is at: ");
  Serial.println(Ethernet.localIP());

  // Start watchdog
  wdt_enable(WDTO_4S);
}

void loop() {
  // Listen for incoming clients
  EthernetClient client = server.available();
  rest.handle(client);
  wdt_reset();
}

// Change light status REST API function
int changeLightStatus(String command) {
  Serial.println(command);

  if (lightStatus) {
    digitalWrite(pin, LOW);
  } else {
    digitalWrite(pin, HIGH);
  }

  lightStatus = !lightStatus;
}
