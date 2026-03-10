#!/bin/bash
service mysql start
mysql -u root -e "CREATE DATABASE IF NOT EXISTS Vigilante;"
mysql -u root Vigilante < backend/Vigilante_v2_configurable.sql
