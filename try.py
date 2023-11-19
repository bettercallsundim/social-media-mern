n,x=map(int,input().split(" "))
ctr=0
import math

for y in range(2, n+1):
  lg=max(y,x)
  mn=min(y,x)
  if (lg%mn==0):
    ctr+=1
print(ctr)