import React, { PureComponent } from 'react';
import { getReq } from '../../util/apiUtil';
import { messages } from '../../util/messages';
import dogPreviewGif from '../../assets/dog-preview.gif';

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

    renderDefaultDogPreview = (errorMessage) => {
        return (
            <>
                <img className="card-img" src={dogPreviewGif} alt="Default dog preview" />
                <div className="card-image-text">{errorMessage}</div>
            </>
        )
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
                        loaderStatus === 'loading' ? <div className="loader-center-align">
                            <div className="loader"></div>
                        </div> :
                            loaderStatus === 'succeeded' ?
                                imageURL ? <img className="card-img" src={imageURL} alt="Breed info" /> : this.renderDefaultDogPreview(messages.previewNotAvailableMsg)
                                : loaderStatus === 'failed' ? this.renderDefaultDogPreview(errorMessage) : null
                    }
                </div>
                <div className="card-body">
                    <p><b>Breed name: </b> {data?.name || 'N/A'}</p>
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