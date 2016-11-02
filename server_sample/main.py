import socket, machine, neopixel

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(0)

np = neopixel.NeoPixel(machine.Pin(4), 4)

def setColor(r,g,b):
	np[0] = (r, g, b)
	np[1] = (r, g, b)
	np[2] = (r, g, b)
	np[3] = (r, g, b)
	np.write()

while True:
	conn, addr = s.accept()
	print("Got a connection from %s" % str(addr))
	request = conn.recv(1024)
	conn.sendall('HTTP/1.1 200 OK\nConnection: close\nServer: esp8266\nContent-Type: text/html\n\n')
	print("Content = %s" % str(request))
	request = str(request)
	indexColorStart = request.find('Color=')

	if indexColorStart > 0 :
		indexColorEnd = request.find(' ', indexColorStart)
		color = request[indexColorStart+6:indexColorEnd]
		colorParts = color.split(',')
		r, g, b = int(colorParts[0]), int(colorParts[1]), int(colorParts[2])
		print("Color =", r,g,b)
		setColor(r,g,b)
		conn.send(str(r) + ',' + str(g) + ',' + str(b))
	else:
		with open('index.html', 'r') as html:
			conn.send(html.read())
	conn.sendall('\n')
	conn.close()
	print("Connection wth %s closed" % str(addr))
