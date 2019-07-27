import { useMedia } from 'use-media';

export default function* useScreenSize(){
    yield {
        tiny: useMedia({ maxWidth: 480 }),
        extraSmall: useMedia({ maxWidth: 600 }),
        small: useMedia({ maxWidth: 768 }),
        medium: useMedia({ maxWidth: 900 }),
        large: useMedia({ maxWidth: 1024 }),
        extraLarge: useMedia({ maxWidth: 1199 }),
        massive: useMedia({ minWidth: 1200 })
    };
}