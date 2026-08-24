import urllib.request, json
req = urllib.request.Request('http://localhost:8000/api/projects/1/factors', data=json.dumps({'factors':[{'name':'Temp','low':55.0,'high':75.0}]}).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    res = urllib.request.urlopen(req)
    print(res.read())
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode('utf-8'))
