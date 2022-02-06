from bs4 import BeautifulSoup
import requests


url = 'https://en.wikipedia.org/wiki/List_of_current_members_of_the_United_States_House_of_Representatives'
r = requests.get(url)
html_doc = r.text
soup = BeautifulSoup(html_doc, 'html.parser')

c=0
data = {}
for t in soup.find_all('table'):
  #for r in t.find_all('tr'):
#      td = r.find('td')
#      print(td)
#      print(type(tds))
#      print(tds[1])
#      print(d['td'])
  for s in t.find_all('img'):
    #data[s['alt']] = s['src']
    parent = s.parent.parent.parent
    td =  s.parent.parent.parent.find('td')
    name = None
    try:
        name = td['data-sort-value']
    except:
        pass

    if name is not None:
        if name in data:
            print("Already there", name)
        else:
            #print(name)
            data[name] = s['src']
        #print(td.attrs)
    #print(td.attrs) #['data-sort-value'])
    #print(s.parent.parent.parent.name)
    #print(s['alt'], s['src'])
    #c += 1

for k,d in data.items():
    print(k,d)
#print(data)
#print(c)
#print(soup.get_text())
