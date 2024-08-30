import React from 'react';
import { createElement } from 'react';
import styles from './styles.module.scss';
import cx from 'classnames'

const Typography = ({
    type = 'p',
    className = '',
    children,
    ...props
}) =>  {
    return React.createElement(
        type,
        {className : cx(className, styles[type]), ...props}, 
        children 
    );
}

export default Typography