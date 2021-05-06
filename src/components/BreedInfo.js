import React, { PureComponent } from 'react';
import { getReq } from '../util/apiUtil';
import { messages } from '../util/messages';

import './BreedInfo.css';

class BreedInfo extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loaderStatus: 'idle',
            imageURL: '',
            errorMessage: ''
        }
    }

    componentDidMount() {
        this.getImagePath();
    }

    getImagePath = async () => {
        const { data } = this.props;

        if (data?.reference_image_id) {
            this.updateImageRes('loading');
            try {
                const res = await getReq(`images/${data?.reference_image_id}`);
                this.updateImageRes('succeeded', res?.url);
            } catch (error) {
                this.updateImageRes('failed', '', error?.message || messages.failedPreviewMsg);
            }
        } else {
            this.updateImageRes('failed', '', messages.previewNotAvailableMsg);
        }
    }

    updateImageRes = (loaderStatus, imageURL = '', errorMessage = '') => {
        this.setState({
            loaderStatus,
            imageURL,
            errorMessage
        });
    }

    render() {
        const {
            loaderStatus,
            imageURL,
            errorMessage
        } = this.state;

        const { data } = this.props;
        return (
            <div className="card">
                <div className="card-image-block">
                    {
                        loaderStatus === 'loading' ? <div className="loader"></div> :
                            loaderStatus === 'succeeded' ?
                                imageURL ? <img className="card-img" src={imageURL} alt="Breed info" /> : messages.previewNotAvailableMsg
                                : loaderStatus === 'failed' ? <div>{errorMessage}</div> : null
                    }
                </div>
                <div className="card-body">
                    <p><b>Name: </b> {data?.name || 'N/A'}</p>
                    <p><b>Lifespan: </b> {data?.life_span || 'N/A'}</p>
                    <p><b>Bred For: </b> {data?.bred_for || 'N/A'}</p>

                    <p className="mb-0"><b>Height: </b> Imperial  {data?.height?.imperial}</p>
                    <p className="height-adjustment">Metric  {data?.height?.metric}</p>
                </div>
            </div>
        )
    }
}

export default BreedInfo;