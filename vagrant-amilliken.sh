#/bin/bash
cd /vagrant
cp vagrant.bashrc ~/.bashrc
cp vagrant.vimrc ~/.vimrc
git config --global user.name "Arthur Milliken"
git config --global user.email "amilliken@gmail.com"
git config --global credential.helper store
git config --global push.default matching
