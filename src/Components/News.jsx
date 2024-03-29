import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinnerr from "./Spinnerr"
import PropTypes from 'prop-types'

export class News extends Component {
    static defaultProps={
        
        country:'in',
        pageSize:8,
        category:"general"
    }
    static propsTypes={
        country:PropTypes.string,
        pageSize:PropTypes.number,
        category: PropTypes.string,

    }

    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            allArticlesLoaded: false,

        }
    }

    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79d1865d3da143af9a397368a07cdd6e&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles,
            totalArticles: parsedData.totalResults,
            loading: false
        });
    }
    handlePrevClick = async () => {
        console.log("Previos");
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79d1865d3da143af9a397368a07cdd6e&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })

    }
    handleNextClick = async () => {
        console.log("Next");
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79d1865d3da143af9a397368a07cdd6e&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            this.setState({ loading: true })
            let data = await fetch(url);
            let parsedData = await data.json()
            console.log(parsedData);
            this.setState({
                articles: parsedData.articles,
                page: this.state.page + 1,
                allArticlesLoaded: false,
                loading: false
            })
        }
    }
    render() {

        return (
            <div className="container my-3">
                <h2 className='text-center'>NewsLion's Top headings</h2>
                {this.state.loading && <Spinnerr />}
                <div className='row'>
                    {!this.state.loading && this.state.articles ? this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title: ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} publishedAt={element.publishedAt}/>
                        </div>
                    }) : <div></div>}
                    {/* 
                    {this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} />
                        </div>
                    })} */}
                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previos</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize) || this.state.allArticlesLoaded} type='button' className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>

                </div>

            </div>
        )
    }
}

export default News