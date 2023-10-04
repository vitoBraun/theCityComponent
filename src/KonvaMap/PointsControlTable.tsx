import React, { useCallback, useState } from "react";
import { LocationPoint, TextPos, TextPosition } from "./types";
import { nanoid } from "nanoid";
import { createRandomPosition } from "./helpers";

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

  const addPoint = useCallback(() => {
    setPoints((prev) => [
      ...prev,
      {
        id: nanoid(),
        pos: createRandomPosition(500, 2000),
        // pos: { x: 1612.4284253073436, y: 1702.802797238678 },
        text: newPointData.text,
        textPos: newPointData.textPos as TextPos,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPointData]);

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
      <button onClick={addPoint}>Добавить</button>
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
                <td>{TextPosition[point.textPos]}</td>
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
