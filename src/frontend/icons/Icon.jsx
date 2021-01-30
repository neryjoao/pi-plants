import React from 'react';
import {icons} from './icons';
import _get from 'lodash/get';

export const Icon = ({name, fill, svgProps, wrapperProps}) => {
    const icon = icons.find(icon => icon.name === name);

    return icon && <div {...wrapperProps} style={{display: 'inline'}}>
        <svg {...svgProps}>
            <path d={_get(icon, `path`)} fill={fill}/>
        </svg>
    </div>
}

Icon.defaultProps = {
    fill: '#000',
    svgProps: {
        width: 17,
        viewBox: "0 0 32 32"
    }
}
