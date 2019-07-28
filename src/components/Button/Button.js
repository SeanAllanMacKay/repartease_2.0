import React from 'react';

import { Button, Tooltip } from 'antd'

const styles = {
    main: {
        height: '50px'
    }
}

export default (props) => {
    const { content, disabled, type, tooltip, onClick, style } = props;
    return (
        <Tooltip
            title={tooltip}
        >
            <Button
                disabled={disabled}
                type={type}
                onClick={onClick}
                style={{ ...styles.main, ...style }}
            >
                {content}
            </Button>
        </Tooltip>
    );
}