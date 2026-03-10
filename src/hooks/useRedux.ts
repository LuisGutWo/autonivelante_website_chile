/**
 * Redux Typed Hooks
 * 
 * Custom hooks with type safety for Redux interactions.
 * Following Redux Toolkit official best practices.
 * 
 * @see https://redux-toolkit.js.org/tutorials/typescript
 */

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";

/**
 * Typed useDispatch hook
 * 
 * Use throughout your app instead of plain `useDispatch`.
 * Provides correct TypeScript types for dispatching actions.
 * 
 * @example
 * ```tsx
 * const dispatch = useAppDispatch();
 * dispatch(addToCart({ id: '1', title: 'Product', price: 100, image: '/img.jpg' }));
 * ```
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed useSelector hook
 * 
 * Use throughout your app instead of plain `useSelector`.
 * Provides correct TypeScript types for state selection.
 * 
 * @example
 * ```tsx
 * const cartItems = useAppSelector((state) => state.cart);
 * const itemCount = useAppSelector((state) => state.cart.length);
 * ```
 */
export const useAppSelector = useSelector.withTypes<RootState>();
