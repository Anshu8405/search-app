import React, { Component } from 'react';

import { debounce } from '../util/utility';
import { getReq } from '../util/apiUtil';
import BreedInfo from './BreedInfo';

import './Search.css';

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchKey: '',
            loaderStatus: 'idle',
            breedList: [],
            errorMessage: null
        }
    }

    debounceSearchResultsAPI = debounce(() => this.getSearchResults(), 1000);

    // Update input key changes in state
    handleInputChange = (event) => {
        this.setState({
            searchKey: event.target.value,
            loaderStatus: 'loading',
        }, () => {
            this.debounceSearchResultsAPI();
        });
    }

    // Call API to fetch result based on search key
    getSearchResults = async () => {
        const { searchKey } = this.state;
        if (searchKey && searchKey.trim()) {
            try {
                const res = await getReq(`breeds/search?q=${searchKey.trim()}`);
                // Sort response
                res.sort((a, b) => a?.name?.localeCompare(b?.name)
                    || a?.height?.imperial?.localeCompare(b?.height?.imperial)
                    || a?.life_span?.localeCompare(b?.life_span));
                this.updateSearchRes('succeeded', res);
            } catch (error) {
                this.updateSearchRes('failed', [], error.status || error.message || 'Oops! Something went wrong');
            }
        } else {
            this.updateSearchRes('idle');
        }
    }

    // Update search response in state
    updateSearchRes = (loaderStatus, breedList = [], errorMessage = '') => {
        this.setState({
            loaderStatus,
            breedList,
            errorMessage
        });
    }


    render() {
        const { searchKey, loaderStatus, breedList, errorMessage } = this.state;

        return (
            <div>
                <input className="form-control"
                    aria-label="search"
                    name="search"
                    placeholder="Search breed by name"
                    onChange={this.handleInputChange}
                    value={searchKey}
                    autoComplete={'off'}
                />

                {searchKey &&
                    <>
                        {
                            loaderStatus === 'loading' ? <div className="loader"></div> :
                                <>
                                    {loaderStatus !== 'idle' && <h4>Showing results for <span className="blueBG">{searchKey}</span></h4>}
                                    {loaderStatus === 'succeeded' ? <>
                                        {
                                            breedList?.length ?
                                                <div className="container">
                                                    {breedList.map(breedData => <BreedInfo data={breedData} key={breedData.id.toString()} />)}
                                                </div>
                                                : 'We Couldn\'t find a match. Please try another search.'
                                        }
                                    </> : loaderStatus === 'failed' ? <div className="error">Error: {errorMessage}</div> :
                                        null}
                                </>
                        }
                    </>
                }
            </div>
        )
    }
}

export default Search
