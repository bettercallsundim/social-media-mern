# 3 5 = 2
# 6 8 = 3
# 4 9 = 5
n=int(input())
ls=[]
for x in range(n):
  ls.append(list(map(int,input().split(" "))))
dls=list(map(lambda a:a[1]-a[0],ls))
ls.sort(key=lambda t:dls.count(t[1]-t[0]))
ctr=1
print(ls)
for x in range(n-1):
  if (ls[x][1]<=ls[x+1][0]):
    ctr+=1

print(ctr)
