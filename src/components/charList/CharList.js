import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);


    // state = {
    //     charList: [],
    //     loading: true,
    //     error: false,
    //     loadingMore: false,
    //     offset: 210,
    //     charEnded: false,
    // }

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setLoadingMore(false) : setLoadingMore(true)

        getAllCharacters(offset)
            .then(onCharListLoaded)
        // .catch(onError)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        // this.setState(({ offset, charList }) => ({
        //     charList: [...charList, ...newCharList],
        //     loading: false,
        //     loadingMore: false,
        //     offset: offset + 9,
        //     charEnded: ended
        // }))

        setCharList(charList => [...charList, ...newCharList]);
        // setLoading(loading => false);
        setLoadingMore(loadingMore => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    // const onError = () => {
    //     // this.setState({
    //     //     error: true,
    //     //     loading: false,
    //     // })
    //     setError(error => true);
    //     setLoading(loading => false);
    // }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(data) {
        const elements = data.map((item, i) => {
            let imageStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imageStyle = { 'objectFit': 'contain' };
            }

            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imageStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    // const { charList, loading, error, offset, loadingMore, charEnded } = this.state;
    const elements = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !loadingMore ? <Spinner /> : null;
    // const content = !(loading || error) ? elements : null;

    return (
        <div className="char__list" >
            {errorMessage}
            {spinner}
            {elements}
            <button className="button button__main button__long"
                disabled={loadingMore}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;