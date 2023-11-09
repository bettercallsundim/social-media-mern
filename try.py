t=int(input())
tst="abcdefghijklmnopqrstuvwxyz"
for x in range(t):
  ss=input()
  if((tst.index(ss[1]))<(tst.index(ss[0]))):
    print((tst.index(ss[0])*25)+(tst.index(ss[1]))+1)
  else:
    print((tst.index(ss[0])*25)+(tst.index(ss[1])))