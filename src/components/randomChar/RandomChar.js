import { useState, useEffect } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    // state = {
    //     // name: null,
    //     // description: null,
    //     // thumbnail: null,
    //     // homepage: null,
    //     // wiki: null,

    //     // передаємо пустий обєкт якщо будуть інші додаткові поля
    //     char: {},
    //     // for spinner
    //     loading: true,
    //     error: false
    // }

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    }, [])


    // при монтуванні викликаємо запит
    // componentDidMount() {
    //     // this.tot.foo = 1; // test <ErrorBoundary>
    //     this.updateChar();
    // }

    // винесли для оптимізації
    const onCharLoaded = (char) => {
        // this.setState({
        //     char,
        //     loading: false
        // })
        setChar(char);
        setLoading(loading => false);
    }

    // show spinner
    const onCharLoading = (char) => {
        // this.setState({
        //     loading: true
        // })
        setLoading(loading => true);
    }

    const onError = (char) => {
        // this.setState({
        //     loading: false,
        //     error: true
        // })
        setLoading(loading => false);
        setError(error => true);
    }

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        onCharLoading();
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }

    // const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="randomchar" >
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;

    let imageStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imageStyle = { 'objectFit': 'contain' };
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} style={imageStyle} alt="Random character" className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;