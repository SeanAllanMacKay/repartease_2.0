import React from 'react';

import { Button, Tooltip } from 'antd'

export default (props) => {
    const { content, disabled, type, tooltip } = props;
    return (
        <Tooltip
            title={tooltip}
        >
            <Button
                disabled={disabled}
                type={type}
            >
                {content}
            </Button>
        </Tooltip>
    );
}