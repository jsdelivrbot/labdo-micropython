import machine, neopixel, time

numberOfLEDs = 96

np = neopixel.NeoPixel(machine.Pin(4), numberOfLEDs)

pos = 0
while True:
	if machine.Pin(0, machine.Pin.IN).value() == 0:
		for n in range(numberOfLEDs):
			if n == pos:
				np[n] = (0, 255, 0)
			else:
				np[n] = (50, 0, 0)
	else:
		for n in range(numberOfLEDs):
			if n == pos:
				np[n] = (255, 255, 255)
			else:
				np[n] = (50, 0, 0)
	np.write()
	pos = (pos + 1) % 4
	time.sleep_ms(10)
