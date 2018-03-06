import os, sys, json
from subprocess import call

"""
Preparation: note some paths
"""
script_dir = os.getcwd()

client_dir = os.path.join(script_dir, 'client/angular-demos')
client_dist = os.path.join(script_dir, 'client/angular-demos/dist')

server_dir = os.path.join(script_dir, 'server')
server_dist = os.path.join(script_dir, 'server/angular')

environment = 'prod'
project = 'time-for-a-demo'

"""
Step 1: Make a frontend-build
"""
print "step 1: make an angular build"
os.chdir(client_dir)
os.system('ng build --prod --aot --environment {}'.format(environment))
print "step 1 completed."

"""
Step 2: clear ./server/angular/*
"""
print "step 2: clear target directory"
cmd = "rm -r {}/*".format(server_dist)
os.system(cmd)
print "print step 2 completed"

"""
Step 3: copy dist file over
"""
print "step 3: copying files to target directory"
cmd  = "cp -r {}/* {}".format(client_dist, server_dist)
os.system(cmd)
print "step 3 completed"

print "step 4: re-writing index.html"
f = open(server_dist + '/index.html','r')
filedata = f.read()
f.close()
newdata = filedata \
  .replace('href="styles.', 'href="/angular/styles.') \
  .replace('src="inline.', 'src="/angular/inline.') \
  .replace('src="polyfills.', 'src="/angular/polyfills.') \
  .replace('src="main.', 'src="/angular/main.') \
  .replace('href="favicon', 'href="/angular/favicon')
f = open(server_dist + '/index.html', 'w')
f.write(newdata)
f.close()
print "step 4 completed"


print "last step: deploy to app engine"
os.chdir(server_dir) 
cmd = "gcloud app deploy --project {} --quiet".format(project)
os.system(cmd)
print """
And you're live! Nicly done!

Check out https://time-for-a-demo.appspot.com to view your work!
"""


"""
Notes:

gcloud app create --region=europe-west
gcloud config set project time-for-a-demo

"""


