# Payara Script

This command line utility is intended to help with starting and administrating Payara server versions, as well as installing them from maven central or Nexus.

## Quick Start

Install a Payara version:

~~~
bash> payara install 5.191
~~~

Configure the active Payara version:

~~~
bash> payara set 5.191
~~~

Start Payara Server:

~~~
bash> payara start
~~~

Monitor the server log:

~~~
bash> payara log
~~~

## Installing Versions From Nexus

First, configure your nexus username and password:

~~~
bash> payara set username myusername
bash> payara set password mypassword
~~~

Then, install the patched version:

~~~
bash> payara install 5.191.8
~~~

## Killing Payara

To kill all running Payara instances, run:

~~~
bash> payara kill
~~~

## Resetting the Payara installation

If you want to reset the running Payara version to a clean installation, run:

~~~
bash> payara reset
~~~