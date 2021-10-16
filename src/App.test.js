import { useColumnsList } from './CustomHooks';
import { renderHook } from '@testing-library/react-hooks';

const ColumnsList = [
  {
    name: "Product",
    function: "dimension"
  },
  {
    name: "Year",
    function: "dimension"
  },
  {
    name: "Country",
    function: "dimension"
  },
  {
    name: "Cost",
    function: "measure"
  },
  {
    name: "Revenue",
    function: "measure"
  },
  {
    name: "Units sold",
    function: "measure"
  }
]

test('should return columns data after fetch', async () => {  
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(ColumnsList),
    })
  );
  
  const { result, waitForNextUpdate } = renderHook(() =>
    useColumnsList([])
  );
  
  await waitForNextUpdate();
  
  expect(result.current).toStrictEqual(ColumnsList);
});
