#!/bin/bash
CURRENT_BRANCH=`git symbolic-ref --short -q HEAD`
DIST=/var/www/adamsandwich.com
REPO=/var/repo/adamsandwich.com

empty_dist(){
    echo "[exec]clean dist"
    rm -rf $DIST/*
}

before_install(){
    cd $REPO
    # install dependencies
    bundle install
    # build
    jekyll build
}

transfer_file(){
    echo "build ==> dist"
    scp -r $REPO/_site/* $DIST/
}

if [ $CURRENT_BRANCH != "jekyll" ]; then
    echo "Wrong branch."
    exit 0
fi

before_install
empty_dist
transfer_file
