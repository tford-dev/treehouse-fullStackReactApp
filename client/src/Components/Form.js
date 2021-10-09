/* eslint-disable */ 
import React from 'react'

export default (props) => {
	const {
		cancel,
		errors,
		submit,
		submitButtonText,
		elements,
	} = props;

	function handleSubmit(event) {
		event.preventDefault();
		submit();
	}

	function handleCancel(event) {
		event.preventDefault();
		cancel();
	}

  return (
		<div>
			<ErrorsDisplay errors={errors} />
				<form onSubmit={handleSubmit}>
					{elements()}
					<div className="pad-bottom">
						<button className="button" type="submit">{submitButtonText}</button>
						<button className="button button-secondary" onClick={handleCancel}>Cancel</button>
					</div>
				</form>
		</div>
  );
}

//function to display errors when invalid/empty values are in submitted in a required input
function ErrorsDisplay({ errors }) {
    let errorsDisplay = null;
        if (errors.length) {
            errorsDisplay = (
                <div className="wrap validation--errors">
                    <h3>Validation errors</h3>
                        <div>
                            <ul>
								{/*Loops through errors from required inputs*/}
                                {errors.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </div>
                </div>
        );
}

  return errorsDisplay;
}
