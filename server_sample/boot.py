import network, machine

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect('FabLab Karlsruhe', 'foobar42')

while not wlan.isconnected():
    machine.idle()

print(wlan.ifconfig())
