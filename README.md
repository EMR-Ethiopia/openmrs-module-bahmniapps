# Bahmni Apps for Ethiopia 

This fork of Bahmni Apps was developed and customized to support Ethiopian Health care EMR system. This forks works to address multiple langue support required by health care systems in Ethiopia.  The fork also aims to address the complex patient addressing and identification mechanism required by the Ethiopian health care system. This fork is developed with a desire to maintain the under laying building blocks and modules of Bahmni Apps. The compatibility between the Bahmni Apps and this fork is strongly maintained to guarantee that patches and updates can easily be ported and integrated. 

# Contributing to Bahmni Apps for Ethiopia 

If interested in contributing and collaborating on this project please reach out to the maintainers at Consultingshf@gmail.com

# Building Bahmni Apps for Ethiopia 
For building and testing instruction please follow the instructions outlined in the Bahmni Apps page. 


# Bahmni Apps

[![Build Status](https://travis-ci.org/Bahmni/openmrs-module-bahmniapps.svg?branch=master)](https://travis-ci.org/Bahmni/openmrs-module-bahmniapps)

This repository acts as the front end for the **Bahmni EMR**. It is compeltely written in **AngularJS**.


# Build

Please visit https://bahmni.atlassian.net/wiki/display/BAH/Working+on+Bahmni+OpenMRS+frontend for detailed instructions on **building** and **deploying** the front end

# Project structure

<pre>
|-- .tx
|   
|-- scripts
|	
`-- ui
    |-- Gruntfile.js
    |-- app
    |	|-- admin
    |   |-- adt
    |   |-- clinical
    |   |-- common
    |   |-- document-upload
    |   |-- home
    |	|-- i18n
    |   |-- images
    |   |-- orders
    |   |-- registration
    |   |-- reports
    |
    |-- .jshint.rc
    |-- bower.json
    |-- package.json
</pre>
