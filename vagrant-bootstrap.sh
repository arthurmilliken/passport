#!/usr/bin/env bash
apt-get update
apt-get -y install \
	curl \
	git \
	python \
	ruby \
	wget
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt-get -y install \
	build-essential \
	nodejs
wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh
