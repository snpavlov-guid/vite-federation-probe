import styles from './styles.module.css'
import { useMemo } from 'react';
import type { NavigateFunction, Location } from 'react-router-dom';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';

// Интерфейс для пропсов компонента
interface TopMenuProps {
    className? :string
}

export const MainMenu: React.FC<TopMenuProps> = ({
  className = ""
 }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const createmenuItem = (
        label: string, 
        path: string,
        { location, navigate }: { location: Location; navigate: NavigateFunction }) => 
        ({
            label,
            path,
            onClick: () => {
                navigate(path);
            },
            active: !!matchPath(`${path}/*`, location.pathname),
        });

     const items = useMemo(
        () => [
            createmenuItem('Приложение React', '/tasklistreact', { location, navigate }),
            createmenuItem('Приложение Vue', '/tasklistvue', { location, navigate }),
            createmenuItem('Приложение Solid', '/tasklistsolid', { location, navigate }),
        ],
        [navigate, location],
    );   

    return (
        <nav className={`${styles['app-menu']} ${className}`}>
            {items.map(item => (
              <a key={item.path} href={item.path} 
                className={item.active ? 'active' : ''} >
                {item.label}
              </a>
            ))}
        </nav>
    );
};


// import { HeaderMenu } from 'uikit';

// import { useMemo } from 'react';
// import type { NavigateFunction, Location } from 'react-router-dom';
// import { useNavigate, useLocation, matchPath } from 'react-router-dom';

// const createmenuItem = (
//     label: string,
//     path: string,
//     { location, navigate }: { location: Location; navigate: NavigateFunction },
// ) => ({
//     label,
//     onClick: () => {
//         navigate(path);
//     },
//     active: !!matchPath(`${path}/*`, location.pathname),
// });

// export function MainMenu() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const items = useMemo(
//         () => [
//             createmenuItem('Проекты', '/projects', { location, navigate }),
//             createmenuItem('Справочники', '/catalogs', { location, navigate }),
//         ],
//         [navigate, location],
//     );

//     return <HeaderMenu items={items} />;
// }

// MainMenu.displayName = 'MainMenu';

