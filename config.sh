#mongo installation
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.0.1.tgz
tar xvf mongodb-linux-x86_64-ubuntu1404-3.0.1

sudo su -
cd /home/jeremy/mongodb-linux-x86_64-ubuntu1404-3.0.1/bin/
cp * /usr/local/bin
exit

#see this webpage for more configuration possibly
#http://learn.mean.io/#mean-stack-prerequisite-technologies-linux