// Core
import React, { Component } from 'react';

// Instruments
import { array } from 'prop-types';
import Styles from './styles.scss';

// Components
import Movie from '../Movie';
import ModalWindow from '../ModalWindow';
import WishList from '../WishList';

export default class Content extends Component {
    static propTypes = {
        moviesList: array.isRequired
        //latestMoviesList:      array.isRequired,
        //mostPopularMoviesList: array.isRequired,
        //moviesListGotBySearch: array
    };
/*     static defaultProps = {
        moviesListGotBySearch: [],
        mostPopularMoviesList: [],
        latestMoviesList:      []
    }; */

    constructor () {
        super();

        this.triggerModalWindow = ::this._triggerModalWindow;
        this.closeModalWindow = ::this._closeModalWindow;
        this.getMovieInfo = ::this._getMovieInfo;
        this.addMovieToWishList = ::this._addMovieToWishList;
        this.isMovieInWishList = ::this._isMovieInWishList;
        this.deleteMovieFromWishList = ::this._deleteMovieFromWishList;
    }

    state = {
        isModalWindowTriggered:    false,
        movieInModalWindow:        {},
        imagePath:                 '',
        wishListTrigger:           false,
        isMovieInWishList:         false,
        dataUpdate:                false
    };

   async _getMovieInfo (movie, imagePath) {
        this.isMovieInWishList(movie);
        this.setState(() => ({
            movieInModalWindow: movie,
            imagePath
        }));
        await this.triggerModalWindow(movie);
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

        if (!localStorage.getItem('wishList')) {
            localStorage.setItem('wishList', JSON.stringify([]));
        }

        if (!isMovieIncludedToWishList) {
            let wishList = JSON.parse(localStorage.getItem('wishList'));

            wishList = [movie, ...wishList];
            localStorage.setItem('wishList', JSON.stringify(wishList));
            this.setState(() => ({ isMovieIncludedToWishList: true }));
        } else {
            this.setState(() => ({ isMovieIncludedToWishList: false }));
        }
    }
    _deleteMovieFromWishList (movieId) {
        const wishListCurrent = JSON.parse(localStorage.getItem('wishList'));

        const wishList = wishListCurrent.filter((movie) => movie.id !== movieId);

        this.setState(() => ({ dataUpdate: true }));
        localStorage.setItem('wishList', JSON.stringify(wishList));
    }
    _isMovieInWishList (movie) {
        const interimList = JSON.parse(localStorage.getItem('wishList'));

        if (interimList) {
            const ifMovieIsInWishList = interimList.find((item) => item.id === movie.id);

            if (ifMovieIsInWishList) {
                this.setState(() => ({
                    isMovieIncludedToWishList: true
                }));
            } else {
                this.setState(() => ({
                    isMovieIncludedToWishList: false
                }));
            }
        }
    }

    render () {
        const {
            isModalWindowTriggered,
            movieInModalWindow,
            imagePath,
            isMovieIncludedToWishList
        } = this.state;

        const wishList = JSON.parse(localStorage.getItem('wishList'));

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

        const { moviesList } = this.props;

        const wishListTrigger = wishList
            ? <WishList
                deleteMovieFromWishList = { this.deleteMovieFromWishList }
                wishList = { wishList }
            />
            : null;

        /* const moviesListGotBySearchToRender = moviesListGotBySearch.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                overview,
                release_date
            }) => (
                <Movie
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
        ); */

/*         const advert = moviesListGotBySearch.length === 0
            ? <h3 className = { Styles.title } >Oi, Your Advert can be Here!!</h3>
            : <div className = { Styles.content }>
                <h3 className = { Styles.title }>Content of Movies</h3>
                <span className = { Styles.content_list }>{ moviesListGotBySearchToRender }</span>
            </div>; */
 /*        const popularMoviesListToRender = mostPopularMoviesList.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                overview,
                release_date
            }) => (
                <Movie
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
            )); */

        const moviesListToRender = moviesList.map(
            ({
                id,
                vote_average,
                title,
                popularity,
                poster_path,
                backdrop_path,
                overview,
                release_date
            }) => (
                <Movie
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
            ));

        return (
            <section className = { Styles.content } >
                { modalWindowToShow }
                <div className = { Styles.content_header_divider }>
                    <div className = { Styles.side_bar }>
                        { wishListTrigger }
                    </div>
                    <div className = { Styles.content }>
                        <div className = { Styles.content_list }>
                            { moviesListToRender }
                        </div>
{/*                         <div>
                            { advert }
                        </div> */}
                        {/* <h4 className = { Styles.title }>The Most Popular</h4>
                        <div className = { Styles.content_list }>
                            { popularMoviesListToRender }
                        </div>
                        <h5 className = { Styles.title }>Latest Arrived</h5>
                        <div className = { Styles.content_list }>
                            { latestMoviesListToRender }
                        </div> */}
                    </div>
                </div>
            </section>
        );
    }
}
