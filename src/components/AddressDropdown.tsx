import React, { useState, useEffect } from "react";
import provincesDataRaw from "@/data/province.json";
import regenciesDataRaw from "@/data/regencies.json";
import districtsDataRaw from "@/data/districts.json";
import villagesDataRaw from "@/data/villages.json";

// Definisi tipe data
type Province = { id: number; name: string };
type Regency = { id: number; province_id: number; name: string };
type District = { id: number; regency_id: number; name: string };
type Village = { id: number; district_id: number; name: string };

// Konversi data JSON ke tipe eksplisit
const provincesData: Province[] = provincesDataRaw as Province[];
const regenciesData: Regency[] = regenciesDataRaw as Regency[];
const districtsData: District[] = districtsDataRaw as District[];
const villagesData: Village[] = villagesDataRaw as Village[];

type AddressDropdownProps = {
    onChange: (selection: {
        provinceName: string;
        regencyName: string;
        districtName: string;
        villageName: string;
    }) => void;
};

const AddressDropdown: React.FC<AddressDropdownProps> = ({ onChange }) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [regencies, setRegencies] = useState<Regency[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedRegency, setSelectedRegency] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedVillage, setSelectedVillage] = useState<number | null>(null);

    useEffect(() => {
        setProvinces(provincesData);
    }, []);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = parseInt(e.target.value);
        setSelectedProvince(provinceId);
        setSelectedRegency(null);
        setSelectedDistrict(null);
        setSelectedVillage(null);

        setRegencies(regenciesData.filter((r) => r.province_id === provinceId));
        setDistricts([]);
        setVillages([]);

        // Kirim update nama provinsi dan kosongkan yg lain
        const provinceName = provinces.find(p => p.id === provinceId)?.name || "";
        onChange({ provinceName, regencyName: "", districtName: "", villageName: "" });
    };

    const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const regencyId = parseInt(e.target.value);
        setSelectedRegency(regencyId);
        setSelectedDistrict(null);
        setSelectedVillage(null);

        setDistricts(districtsData.filter((d) => d.regency_id === regencyId));
        setVillages([]);

        const regencyName = regencies.find(r => r.id === regencyId)?.name || "";
        const provinceName = provinces.find(p => p.id === selectedProvince!)?.name || "";
        onChange({ provinceName, regencyName, districtName: "", villageName: "" });
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = parseInt(e.target.value);
        setSelectedDistrict(districtId);
        setSelectedVillage(null);

        setVillages(villagesData.filter(v => v.district_id === districtId));

        const districtName = districts.find(d => d.id === districtId)?.name || "";
        const regencyName = regencies.find(r => r.id === selectedRegency!)?.name || "";
        const provinceName = provinces.find(p => p.id === selectedProvince!)?.name || "";
        onChange({ provinceName, regencyName, districtName, villageName: "" });
    };

    const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const villageId = parseInt(e.target.value);
        setSelectedVillage(villageId);

        const villageName = villages.find(v => v.id === villageId)?.name || "";
        const districtName = districts.find(d => d.id === selectedDistrict!)?.name || "";
        const regencyName = regencies.find(r => r.id === selectedRegency!)?.name || "";
        const provinceName = provinces.find(p => p.id === selectedProvince!)?.name || "";

        onChange({ provinceName, regencyName, districtName, villageName });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <select
                    value={selectedProvince || ""}
                    onChange={handleProvinceChange}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Pilih</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
                <select
                    value={selectedRegency || ""}
                    onChange={handleRegencyChange}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Pilih</option>
                    {regencies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <select
                    value={selectedDistrict || ""}
                    onChange={handleDistrictChange}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Pilih</option>
                    {districts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                <select
                    value={selectedVillage || ""}
                    onChange={handleVillageChange}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="">Pilih</option>
                    {villages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
        </div>


    );
};

export default AddressDropdown;
