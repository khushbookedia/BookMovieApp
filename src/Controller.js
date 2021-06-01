import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import Header from "./common/header/Header";
import Home from "./screens/home/Home";
import Confirmation from "./screens/confirmation/Confirmation";
import BookShow from "./screens/bookshow/BookShow";
import Details from "./screens/details/Details";

//handling the navigation between all the pages using react router dom
export default function Controller(){
    const baseUrl = "http://localhost:8085/api/v1/";
    return(
        <Fragment>
            <Header/> 
            <Route exact path='/' render={(props)=> <Home {...props} baseUrl={baseUrl} />}></Route>
            <Route path='/movie/:id' render={(props)=> <Details {...props} baseUrl={baseUrl} />}></Route>
            <Route path='/bookshow/:id' render={(props)=> <BookShow {...props} baseUrl={baseUrl} />}></Route>
            <Route path='/confirm/:id' render={(props)=> <Confirmation {...props} baseUrl={baseUrl} />}></Route>
        </Fragment>
    )
}