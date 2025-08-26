import { create } from 'zustand';

const useFilterStore = create((set) => ({
    filterField: '',
    filterValue: '',
    setFilter: (field, value) => set({ filterField: field, filterValue: value }),
    clearFilter: () => set({ filterField: '', filterValue: '' }),
}));

export default useFilterStore;