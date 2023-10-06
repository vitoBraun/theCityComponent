import React, { useCallback, useState } from "react";
import { LocationPoint, AddressOrient, AddresOrientation } from "./types";
import { nanoid } from "nanoid";
import useGeoPoint from "./useGeoPoint";

function PointsControl({
  points,
  setPoints,
}: {
  points: LocationPoint[];
  setPoints: (value: React.SetStateAction<LocationPoint[]>) => void;
}) {
  const [newPointData, setNewPointData] = useState<{
    newPointAddress: string;
    newPointAddressPos: AddressOrient;
  }>({
    newPointAddress: "Правды 24",
    newPointAddressPos: "right",
  });

  const handleChangeNewPoint = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewPointData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePoint = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPoints((prevPoints) => {
      const pointIndex = prevPoints.findIndex(
        (point) => point.id === e.target.id
      );

      const updatedPoint = {
        ...prevPoints[pointIndex],
        [e.target.name]: e.target.value,
      };

      const updatedPoints = [...prevPoints];
      updatedPoints[pointIndex] = updatedPoint;

      return updatedPoints;
    });
  };

  const { isFetching, fetchGeoPoint } = useGeoPoint(
    newPointData.newPointAddress
  );

  const addPoint = useCallback(async () => {
    const data = await fetchGeoPoint();

    if (!data || data.error || data.geocode_address.length === 0) {
      alert("Адрес не найден");
      return;
    }

    const pos = {
      x: Math.round(data?.geometry?.pixel_coordinates.x),
      y: Math.round(-data?.geometry?.pixel_coordinates.y),
    };

    setPoints((prev) => [
      ...prev,
      {
        id: nanoid(),
        pos,
        address: newPointData.newPointAddress,
        addressPos: newPointData.newPointAddressPos,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPointData, fetchGeoPoint]);

  const handleDeletePoint = (
    e: React.MouseEvent<HTMLButtonElement> & { target: { id: string } }
  ) => {
    const filteredPoints = points.filter((p) => p.id !== e.target.id);
    setPoints(filteredPoints);
  };

  return (
    <>
      <label htmlFor="#textInput">Адрес</label>
      <input
        type="text"
        id="textInput"
        name="newPointAddress"
        value={newPointData.newPointAddress}
        onChange={handleChangeNewPoint}
      />
      <select
        value={newPointData.newPointAddressPos}
        name="newPointAddressPos"
        onChange={handleChangeNewPoint}
      >
        {Object.keys(AddresOrientation).map((pos) => (
          <option value={pos} key={pos}>
            {AddresOrientation[pos as AddressOrient]}
          </option>
        ))}
      </select>
      <button onClick={addPoint} disabled={isFetching}>
        Добавить
      </button>

      {points.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Адрес</th>
              <th>Координаты</th>
              <th>Ориентация текста</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td>
                  <input
                    id={point.id}
                    type="text"
                    name="address"
                    value={point.address}
                    onChange={handleChangePoint}
                  />
                </td>
                <td>
                  x: {point.pos.x} y: {point.pos.y}
                </td>
                <td>
                  <select
                    id={point.id}
                    value={point.addressPos}
                    name="addressPos"
                    onChange={handleChangePoint}
                  >
                    {Object.keys(AddresOrientation).map((pos) => (
                      <option value={pos} key={pos}>
                        {AddresOrientation[pos as AddressOrient]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button id={point.id} onClick={handleDeletePoint}>
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default React.memo(PointsControl);
