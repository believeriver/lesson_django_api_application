import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

import type { AppDispatch } from "../../app/store";

import { fetchAsyncCompanies } from "./irbankSlice";
import { selectCompanise } from "./irbankSlice";

// import { Navigation } from "@mui/icons-material";
import Navigation from "../front/Navigation";

const IrbankMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const companies = useSelector(selectCompanise);

  //テーブルデータ
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("dividend");

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCompanies = React.useMemo(() => {
    if (!companies) return [];
    return [...companies].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [companies, order, orderBy]);

  // 会社データの取得
  useEffect(() => {
    const fetchIrbankCompaniesBootLoader = async () => {
      await dispatch(fetchAsyncCompanies());
    };
    fetchIrbankCompaniesBootLoader();
  }, [dispatch]);
  console.log("[INFO] irbank companise in IrbankMain.tsx", companies);

  return (
    <div>
      <Navigation />
      {/* IrbankMain */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>コード</TableCell>
              <TableCell>会社名</TableCell>
              <TableCell align="right">株価</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "dividend"}
                  direction={orderBy === "dividend" ? order : "asc"}
                  onClick={() => handleSort("dividend")}
                >
                  配当利回り(%)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">配当ランク</TableCell>
              <TableCell>業種</TableCell>
              <TableCell>説明</TableCell>
              <TableCell align="right">PER</TableCell>
              <TableCell align="right">PBR</TableCell>
              <TableCell align="right">PSR</TableCell>
              <TableCell>更新日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCompanies.map((company) => (
              <TableRow key={company.code}>
                <TableCell>{company.code}</TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell align="right">{company.stock}</TableCell>
                <TableCell align="right">{company.dividend}</TableCell>
                <TableCell align="right">{company.dividend_rank}</TableCell>

                {/* information 内の項目 */}
                <TableCell>{company.information?.industry}</TableCell>
                <TableCell>{company.information?.description}</TableCell>
                <TableCell align="right">{company.information?.per}</TableCell>
                <TableCell align="right">{company.information?.pbr}</TableCell>
                <TableCell align="right">{company.information?.psr}</TableCell>
                <TableCell>
                  {company.information?.updated_at &&
                    new Date(company.information.updated_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default IrbankMain;
