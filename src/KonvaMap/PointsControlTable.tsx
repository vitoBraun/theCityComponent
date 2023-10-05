import React, { useCallback, useState } from "react";
import { LocationPoint, TextPos, TextPosition } from "./types";
import { nanoid } from "nanoid";
// import { createRandomPosition } from "./helpers";
import useGeoPoint from "./useGeoPoint";

function PointsControlTable({
  points,
  setPoints,
}: {
  points: LocationPoint[];
  setPoints: (value: React.SetStateAction<LocationPoint[]>) => void;
}) {
  const [newPointData, setNewPointData] = useState({
    text: "Ул. Николаева 11В",
    textPos: "right",
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

  const { isFetching, fetchGeoPoint } = useGeoPoint(newPointData.text);

  const addPoint = useCallback(async () => {
    const data = await fetchGeoPoint();

    setPoints((prev) => [
      ...prev,
      {
        id: nanoid(),
        pos: data?.geometry?.pixel_coordinates || { x: 0, y: 0 },
        text: newPointData.text,
        textPos: newPointData.textPos as TextPos,
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
      <label htmlFor="#textInput">Текст</label>
      <input
        type="text"
        id="textInput"
        name="text"
        value={newPointData.text}
        onChange={handleChangeNewPoint}
      />
      <select
        value={newPointData.textPos}
        name="textPos"
        onChange={handleChangeNewPoint}
      >
        {Object.keys(TextPosition).map((pos) => (
          <option value={pos} key={pos}>
            {TextPosition[pos as TextPos]}
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
              <th>Текст</th>
              <th>Координаты</th>
              <th>Ориентация текста</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td>{point.text}</td>
                <td>
                  x: {point.pos.x} y: {point.pos.y}
                </td>
                <td>
                  <select
                    id={point.id}
                    value={point.textPos}
                    name="textPos"
                    onChange={handleChangePoint}
                  >
                    {Object.keys(TextPosition).map((pos) => (
                      <option value={pos} key={pos}>
                        {TextPosition[pos as TextPos]}
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

export default React.memo(PointsControlTable);
