import machine, neopixel, time

np = neopixel.NeoPixel(machine.Pin(0), 4)

pos = 0
while True:
	for n in range(4): # 0..3
		if n == pos:
			np[n] = (255, 255, 255)
		else:
			np[n] = (50, 0, 0)
	
	np.write()
	pos = (pos + 1) % 4
	time.sleep_ms(1000)




if machine.Pin(0, machine.Pin.IN).value() == 0: