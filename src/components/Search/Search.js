import React, { Component } from 'react';

import { debounce } from '../../util/utility';
import { getReq } from '../../util/apiUtil';
import { messages } from '../../util/messages';
import BreedInfo from '../BreedInfo/BreedInfo';

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
                this.updateSearchRes('failed', [], error.message || messages.serverErrorMsg);
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
            <>
                <div className="input-group">
                    <input className="form-control"
                        aria-label="search"
                        name="search"
                        placeholder={messages.searchBreedMsg}
                        onChange={this.handleInputChange}
                        value={searchKey}
                        autoComplete={'off'}
                        aria-describedby="search-addon"
                    />
                    <div className="input-group-append">
                        <span className="input-group-text" id="search-addon"><i className="fa fa-search"></i></span>
                    </div>
                </div>

                {searchKey &&
                    <>
                        {
                            loaderStatus === 'loading' ? <div className="loader-center-align">
                                <div className="loader"></div>
                            </div> :
                                <>
                                    {loaderStatus !== 'idle' && <h4>{messages.showingResultsMsg} <span className="blue-text">{searchKey}</span></h4>}
                                    {loaderStatus === 'succeeded' ? <>
                                        {
                                            breedList?.length ?
                                                <div className="container">
                                                    {breedList.map(breedData => <BreedInfo data={breedData} key={breedData?.id?.toString()} />)}
                                                </div>
                                                : messages.tryAnotherSearchMsg
                                        }
                                    </> : loaderStatus === 'failed' ? <div className="error">Error: {errorMessage}</div> :
                                        null}
                                </>
                        }
                    </>
                }
            </>
        )
    }
}

export default Search;
