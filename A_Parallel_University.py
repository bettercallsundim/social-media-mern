n,s=map(int,input().split(" "))
ls=list(map(int,input().split(" ")))
ss=set(ls)
sz=[]
for x in ss:
  print(x)
  sz.append(ls.count(x))
print(sz)
