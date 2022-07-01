import { useState } from 'react';

import { Dropdown } from './components';
import './App.css';

const ITEMS = ['First Item', 'Second Item', 'Third Item'];

// const ITEMS = [
//     {
//         key: 'first',
//         text: 'First Item',
//     },
//     {
//         key: 'second',
//         text: 'Second Item',
//     },
//     {
//         key: 'third',
//         text: 'Third Item',
//     },
// ];

function App() {
    const [value, setValue] = useState('');
    const [items, setItems] = useState(ITEMS);

    const handleAddItem = (newItem) => {
        setItems([...items, newItem]);
    };

    return (
        <div className='App'>
            <Dropdown
                label='Input'
                value={value}
                items={items}
                onAddItem={handleAddItem}
                onChange={setValue}
            />
        </div>
    );
}

export default App;
