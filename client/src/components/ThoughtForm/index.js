import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';

// thoughts form is on homepage and profile page, so we need to update the cache in both instances.
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';


const ThoughtForm = () => {
    const [thoughtText, setText ] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        // add new addThought to the update.
        update(cache, { data: { addThought } }) {

            // could potentially not exist so, wrap in a try/catch 
            try {
                // update me array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({ 
                    query: QUERY_ME, 
                    // rearranged order to view newest thought at top of profile page.
                    data: { me: { ...me, thoughts: [addThought, ...me.thoughts,] } },
                });
            } catch (e) {
                console.warn('First thought insertion by user!')
            }



            // read what's currently in the cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

            // after reading cache, prepend newest thought to the front of the array 
            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] },
            });
        }
    });

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    
    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought to database
            await addThought({
                variables: { thoughtText }
            });

            // clear form values
            setText('');
            setCharacterCount(0);
        } catch (e) {
            console.log(e);
        }
    }
    
    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className='ml-2'>Something went wrong...</span>}
            </p>
            <form 
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea 
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};


export default ThoughtForm;