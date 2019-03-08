#!/bin/sh
DIST=/var/www/adamsandwich.com
REPO=/var/repo/adamsandwich.com
empty_dist(){
    echo "[exec]clean dist"
    rm -rf $DIST/*
}
before_install(){
    cd $REPO
    echo "[exec]install all dependencies"
    yarn
    echo "[exec]build"
    hexo g
}
transfer_file(){
    echo "[exec]build ==> dist"
    scp -r $REPO/public/* $DIST/
}
before_install
empty_dist
transfer_file