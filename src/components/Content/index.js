// Core
import React, { Component } from 'react';

// Instruments
import { array } from 'prop-types';
import Styles from './styles.scss';
import { Transition } from 'react-transition-group';
import { fromTo } from 'gsap';

// Components
import Movie from '../Movie';
import ModalWindow from '../ModalWindow';
import WishList from '../WishList';

export default class Content extends Component {
    static propTypes = {
        latestMoviesList:      array.isRequired,
        mostPopularMoviesList: array.isRequired,
        moviesListGotBySearch: array
    };
    static defaultProps = {
        moviesListGotBySearch: [],
        mostPopularMoviesList: [],
        latestMoviesList:      []
    };

    constructor () {
        super();

        this.triggerModalWindow = ::this._triggerModalWindow;
        this.closeModalWindow = ::this._closeModalWindow;
        this.getMovieInfo = ::this._getMovieInfo;
        this.addMovieToWishList = ::this._addMovieToWishList;
        this.isMovieInWishList = ::this._isMovieInWishList;
        this.handleWishListToAppear = ::this._handleWishListToAppear;
    }

    state = {
        isModalWindowTriggered:    false,
        movieInModalWindow:        {},
        imagePath:                 '',
        wishListTrigger:           false,
        //wishList:                  [],
        isMovieIncludedToWishList: false,
        dataUpdate:                true 
    };

    _getMovieInfo (movie, imagePath) {
        //const { movieInModalWindow } = this.state;

        this.setState(() => ({ 
            movieInModalWindow: movie,
            imagePath 
        }));

        // this.isMovieInWishList();
        this.triggerModalWindow(movie);
    }

    _triggerModalWindow (movie) {
        
        this.isMovieInWishList(movie);

        this.setState(() => ({ isModalWindowTriggered: true }));
    }

    _closeModalWindow () {
        this.setState(() => ({ isModalWindowTriggered: false }));
    }

    _addMovieToWishList (movie) {

        this.isMovieInWishList(movie);

        const { isMovieIncludedToWishList } = this.state;
        
        /* if (!localStorage.getItem('wishList')) {
            localStorage.setItem('wishList', []);
        } */
        console.log(`_addMovieToWishList --> add to wish list ${localStorage}`);
        if (!isMovieIncludedToWishList) {
            let wishList = JSON.parse(localStorage.getItem('wishList'));
            console.log(`inside _addMovieToWishList`);
            wishList = [movie, ...wishList];
            console.log(`inside _addMovieToWishList ${wishList}`);
            localStorage.setItem('wishList', JSON.stringify(wishList));
            console.log(`_addMovieToWishList --> add to wish list ${JSON.stringify(localStorage)}`);
        }
        // dont know how to update state ... so 
        // this.isMovieInWishList(movie);     
        this.setState(() => {
            dataUpdate: true
        });
    }

    _isMovieInWishList (movie) {
        const interimList = JSON.parse(localStorage.getItem('wishList'));

        if (interimList) {
            const ifMovieIsInWishList = interimList.includes(movie);
            this.setState(() => ({
                isMovieIncludedToWishList: ifMovieIsInWishList
            }));
        }
    }

    _handleWishListToAppear (wishList) {
        fromTo(
            wishList,
            1,
            {
                x:         -400,
                y:         0,
                opacity:   0,
            },
            {
                x:         0,
                y:         0,
                opacity:   1,
            }
        );
    }

    render () {
        const {
            isModalWindowTriggered,
            movieInModalWindow,
            imagePath,
            isMovieIncludedToWishList
        } = this.state;
        /* let wishList = [
            {
                id: 123,
                title: 'Not Empty'
            }
        ];
        
        localStorage.setItem('wishList', JSON.stringify(wishList)); */
        wishList = JSON.parse(localStorage.getItem('wishList'));

        const modalWindowToShow = isModalWindowTriggered
            ? (
                <ModalWindow
                    addMovieToWishList = { this.addMovieToWishList }
                    closeModalWindow = { this.closeModalWindow }
                    id = { movieInModalWindow.id }
                    imagePath = { imagePath }
                    isMovieIncludedToWishList = { isMovieIncludedToWishList }
                    overview = { movieInModalWindow.overview }
                    popularity = { movieInModalWindow.popularity }
                    release_date = { movieInModalWindow.release_date }
                    title = { movieInModalWindow.title }
                    vote_average = { movieInModalWindow.vote_average }
                />
            )
            : null;
        const {
            moviesListGotBySearch,
            mostPopularMoviesList,
            latestMoviesList
        } = this.props;

        const wishListTrigger = wishList
            ? <WishList wishList = { wishList } />
            : null;

        const moviesListGotBySearchToRender = moviesListGotBySearch.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                adult,
                overview,
                release_date
            }) => (
                <Movie
                    adult = { adult }
                    backdrop_path = { backdrop_path }
                    getMovieInfo = { this.getMovieInfo }
                    id = { id }
                    key = { id }
                    overview = { overview }
                    popularity = { popularity }
                    poster_path = { poster_path }
                    release_date = { release_date }
                    title = { title }
                    vote_average = { vote_average }
                />
            )
        );

        const advert = moviesListGotBySearch.length === 0
            ? <h3 className = { Styles.title } >Oi, Your Advert can be Here!!</h3>
            : <div className = { Styles.content }>
                <h3 className = { Styles.title }>Content of Movies</h3>
                <span className = { Styles.content_list }>{ moviesListGotBySearchToRender }</span>
            </div>;

        //console.log(`render in Content -- > movies got by search --> ${moviesListGotBySearch}`);

        const popularMoviesListToRender = mostPopularMoviesList.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                adult,
                overview,
                release_date
            }) => (

                /*CCSTransition*/
                <Movie
                    adult = { adult }
                    backdrop_path = { backdrop_path }
                    getMovieInfo = { this.getMovieInfo }
                    id = { id }
                    key = { id }
                    overview = { overview }
                    popularity = { popularity }
                    poster_path = { poster_path }
                    release_date = { release_date }
                    title = { title }
                    vote_average = { vote_average }
                />

                /*CCSTransition*/
            ));

        const latestMoviesListToRender = latestMoviesList.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                adult,
                overview,
                release_date
            }) => (

                /*CCSTransition*/
                <Movie
                    adult = { adult }
                    backdrop_path = { backdrop_path }
                    getMovieInfo = { this.getMovieInfo }
                    id = { id }
                    key = { id }
                    overview = { overview }
                    popularity = { popularity }
                    poster_path = { poster_path }
                    release_date = { release_date }
                    title = { title }
                    vote_average = { vote_average }
                />

                /*CCSTransition*/
            ));

        return (
            <section className = { Styles.content } >
                { modalWindowToShow }
                { wishListTrigger }
                { advert }
                <h4 className = { Styles.title }>The Most Popular</h4>
                <div className = { Styles.content_list }>
                    { popularMoviesListToRender }
                </div>
                <h5 className = { Styles.title }>Latest Arrived</h5>
                <div className = { Styles.content_list }>
                    { latestMoviesListToRender }
                </div>
            </section>
        );
    }
}
