import { useEffect, useMemo, useRef } from 'react';
import { Checkmark } from './Checkmark';
import './Dropdown.css';

/*
    Just to add a little bit more of TS I assumed that items may be string or objects.
*/
interface ObjectItem {
    key: string;
    text: string;
}

type Item = string | ObjectItem;

interface Props {
    label: string;
    value: Item;
    items: Item[];
    onChange: (value: Item) => void;
    onAddItem: (value: Item) => void;
}

function isObjectItem(arg: Item): arg is ObjectItem {
    return typeof arg === 'object';
}

export const Dropdown = ({
    label,
    value,
    items,
    onAddItem,
    onChange,
}: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [key, text] = useMemo(
        () => (isObjectItem(value) ? [value.key, value.text] : [value, value]),
        [value]
    );

    const changeShowLabel = (type: 'remove' | 'add') => {
        const label = document.getElementById('label');
        if (label) {
            if(type === 'remove' && !inputRef.current?.value) {
                label.classList.remove('dropdown-label-active');
            }
            if(type !== 'remove') {
                label.classList[type]('dropdown-label-active');
            }
        }
    };

    const changeShowItems = (type: 'toggle' | 'remove') => {
        const container = document.getElementById('container');
        const options = document.getElementById('options');
        if (options) {
            options.classList[type]('options-active');
        }
        if (container) {
            container.classList[type]('container-active');
        }
    };

    const handleInputClick = () => {
        const label = document.getElementById('label');
        if (!label?.classList.contains('dropdown-label-active')) {
            changeShowLabel('add');
        } else if (!value) {
            changeShowLabel('remove');
        }
        changeShowItems('toggle');
    };

    const handleAddItem = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.target) {
                const newValue = (e.target as HTMLInputElement).value;
                onAddItem(
                    isObjectItem(items[0])
                        ? { key: newValue, text: newValue }
                        : newValue
                );
                onChange('');
            }
        }
    };

    const handleChange = (item: Item) => {
        onChange(isObjectItem(item) ? { ...item } : item)
        changeShowItems('remove');
    }

    function handleClickOutside(e: TouchEvent | MouseEvent) {
        if (
            inputRef.current &&
            !inputRef.current.contains(e.target as Node) &&
            !(e.target as HTMLElement).classList.contains('dropdown-option')
        ) {
            changeShowItems('remove');
            changeShowLabel('remove');
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    return (
        <div id='container' className='container'>
            <label id='label' htmlFor='dropdown' className='dropdown-label'>
                {label}
            </label>
            <input
                id='dropdown'
                name='dropdown'
                className='dropdown'
                value={text}
                ref={inputRef}
                onChange={(e) => onChange(e.target.value)}
                onClick={handleInputClick}
                onKeyDown={handleAddItem}
            />
            <div id='options' className='dropdown-options-wrapper'>
                {items.map((item, index) => (
                    <div
                        key={`${isObjectItem(item) ? item.key : item}${index}`}
                        className={`dropdown-option${
                            key === (isObjectItem(item) ? item.key : item)
                                ? ' dropdown-option-selected'
                                : ''
                        }`}
                        onClick={() => handleChange(item)}
                    >
                        {isObjectItem(item) ? item.text : item}
                        {key === (isObjectItem(item) ? item.key : item) && (
                            <Checkmark />
                        )}
                    </div>
                ))}
                <div className='highlight' />
            </div>
        </div>
    );
};
