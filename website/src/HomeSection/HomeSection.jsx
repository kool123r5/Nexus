import React, { useRef } from "react";
import "./HomeSection.css";
import Card from "../Card/CardGrid";
import PropTypes from "prop-types";

export default function HomeSection({ uniqueTypeObj, sorted_documents }) {
    let type = Object.keys(uniqueTypeObj);
    let index_array = uniqueTypeObj[type];
    let postObjectArray = [];
    for (let i = 0; i < index_array.length; i++) {
        const index = index_array[i];
        const documentObject = sorted_documents[index];
        postObjectArray.push({
            title: documentObject.title,
            text: documentObject.text,
            author: documentObject.username,
            id: documentObject.id,
        });
    }
    const carouselRef = useRef(null);
    let scrollAmount = 0;
    const cardWidth = 270;

    const handlePreviousClick = () => {
        scrollAmount = Math.max(scrollAmount - cardWidth * 3, 0);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleNextClick = () => {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        scrollAmount = Math.min(scrollAmount + cardWidth * 3, maxScroll);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            <h2 className="carousel_title">{type}</h2>
            <div className="carousel_container">
                <button className="previous_button" onClick={handlePreviousClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-caret-left"
                        viewBox="0 0 16 16"
                    >
                        <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                    </svg>
                </button>
                <button className="next_button" onClick={handleNextClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-caret-right"
                        viewBox="0 0 16 16"
                    >
                        <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                    </svg>
                </button>

                <div className="carousel" ref={carouselRef}>
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                    {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                {postObjectArray.map((postObject) => {
                        return (
                            <Card
                                className="card"
                                key={postObject + Math.random()}
                                title={postObject.title}
                                text={postObject.text}
                                author={postObject.author}
                                id={postObject.id}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}

HomeSection.propTypes = {
    uniqueTypeObj: PropTypes.object,
    sorted_documents: PropTypes.array,
};
