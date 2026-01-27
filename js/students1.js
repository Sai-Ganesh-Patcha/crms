// Student Data Part 1 (Students 01-36)
const STUDENT_DATA_PART1 = [
    { "regno": "23K61A4401", "name": "Acharla Blessy", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "C", "CHEM": "C", "BCME": "B", "IP": "D", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.59, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "B", "EP": "C", "BEEE": "C", "EG": "D", "DS": "C", "EP_LAB": "D", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "B", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 7.34, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "B", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "S", "ES": "S" }, "status": "PASS", "sgpa": 8.28, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "C", "DE": "C", "DBMS": "D", "DLCO": "C", "DE_LAB": "A", "DBMS_LAB": "A", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.62, "credits": 21.0 } } },
    { "regno": "23K61A4402", "name": "Addagarla Keerthi", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "B", "CHEM": "B", "BCME": "B", "IP": "C", "CE_LAB": "A", "CHEM_LAB": "S", "C_LAB": "S", "EWS": "S", "SPORTS": "A" }, "status": "PASS", "sgpa": 8.33, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "S", "EP": "B", "BEEE": "C", "EG": "A", "DS": "A", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "B", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 8.66, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "B", "IDS": "B", "ADS/AA": "B", "OOPJ": "B", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 8.48, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "B", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.48, "credits": 21.0 } } },
    { "regno": "23K61A4403", "name": "Alapati Lokesh", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "A", "CHEM": "B", "BCME": "A", "IP": "C", "CE_LAB": "B", "CHEM_LAB": "B", "C_LAB": "C", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 8.18, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "B", "EP": "C", "BEEE": "D", "EG": "C", "DS": "B", "EP_LAB": "B", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "B", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.56, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "A", "ADS/AA": "C", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "S", "PY_LAB": "S", "ES": "A" }, "status": "PASS", "sgpa": 8.28, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "C", "DLCO": "D", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.05, "credits": 21.0 } } },
    { "regno": "23K61A4404", "name": "Amarapu Manojsatyavaraprasad", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "A", "CHEM": "C", "BCME": "B", "IP": "D", "CE_LAB": "C", "CHEM_LAB": "C", "C_LAB": "S", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.72, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "C", "BEEE": "D", "EG": "D", "DS": "C", "EP_LAB": "D", "ITWS": "C", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 7.12, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "B", "ADS/AA": "B", "OOPJ": "B", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 8.1, "credits": 20.0 }, "sem4": { "subjects": { "OT": "B", "SMDS": "C", "DE": "B", "DBMS": "B", "DLCO": "C", "DE_LAB": "B", "DBMS_LAB": "C", "EDAP_LAB": "C", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.74, "credits": 21.0 } } },
    { "regno": "23K61A4405", "name": "Are Haneesh Kumar", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "A", "CHEM": "C", "BCME": "A", "IP": "E", "CE_LAB": "B", "CHEM_LAB": "B", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.77, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "C", "BEEE": "D", "EG": "C", "DS": "D", "EP_LAB": "D", "ITWS": "B", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.2, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "S", "UHV": "B", "IDS": "C", "ADS/AA": "C", "OOPJ": "B", "IDS_LAB": "S", "OOPJ_LAB": "C", "PY_LAB": "A", "ES": "A" }, "status": "PASS", "sgpa": 8.18, "credits": 20.0 }, "sem4": { "subjects": { "OT": "B", "SMDS": "C", "DE": "B", "DBMS": "D", "DLCO": "A", "DE_LAB": "A", "DBMS_LAB": "C", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.0, "credits": 21.0 } } },
    { "regno": "23K61A4406", "name": "Bellamkonda Venkata Sai Ram", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "E", "LA&C": "F", "CHEM": "E", "BCME": "C", "IP": "F", "CE_LAB": "C", "CHEM_LAB": "C", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "FAIL", "sgpa": 0, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "F", "EP": "E", "BEEE": "C", "EG": "D", "DS": "F", "EP_LAB": "C", "ITWS": "C", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "FAIL", "sgpa": 0, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "D", "UHV": "D", "IDS": "E", "ADS/AA": "D", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "A", "ES": "A" }, "status": "PASS", "sgpa": 6.6, "credits": 20.0 }, "sem4": { "subjects": { "OT": "F", "SMDS": "E", "DE": "D", "DBMS": "F", "DLCO": "C", "DE_LAB": "A", "DBMS_LAB": "D", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "FAIL", "sgpa": 0, "credits": 21.0 } } },
    { "regno": "23K61A4407", "name": "Betrala Sri Charan Raj", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "D", "LA&C": "D", "CHEM": "C", "BCME": "C", "IP": "D", "CE_LAB": "C", "CHEM_LAB": "C", "C_LAB": "C", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.77, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "D", "BEEE": "C", "EG": "B", "DS": "D", "EP_LAB": "C", "ITWS": "B", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 7.37, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "C", "IDS": "C", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "B" }, "status": "PASS", "sgpa": 7.7, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "B", "DBMS": "D", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "A", "EDAP_LAB": "A", "DTI_LAB": "A" }, "status": "PASS", "sgpa": 7.79, "credits": 21.0 } } },
    { "regno": "23K61A4408", "name": "Bondada Venkata Sai Durga", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "C", "CHEM": "C", "BCME": "C", "IP": "E", "CE_LAB": "C", "CHEM_LAB": "C", "C_LAB": "A", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.1, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "D", "BEEE": "C", "EG": "C", "DS": "D", "EP_LAB": "B", "ITWS": "B", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.29, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "A", "IDS": "B", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "A", "ES": "A" }, "status": "PASS", "sgpa": 8.1, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "D", "DE": "C", "DBMS": "C", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.86, "credits": 21.0 } } },
    { "regno": "23K61A4409", "name": "Boni Hemanjali", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "B", "CHEM": "D", "BCME": "D", "IP": "E", "CE_LAB": "C", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.1, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "C", "BEEE": "C", "EG": "C", "DS": "C", "EP_LAB": "C", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 7.27, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "A", "IDS": "B", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "B" }, "status": "PASS", "sgpa": 8.23, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "S", "DBMS": "D", "DLCO": "A", "DE_LAB": "B", "DBMS_LAB": "C", "EDAP_LAB": "A", "DTI_LAB": "A" }, "status": "PASS", "sgpa": 7.93, "credits": 21.0 } } },
    { "regno": "23K61A4410", "name": "Challa Rohanteja", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "D", "CHEM": "D", "BCME": "D", "IP": "E", "CE_LAB": "B", "CHEM_LAB": "B", "C_LAB": "B", "EWS": "B", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.62, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "D", "EG": "E", "DS": "D", "EP_LAB": "C", "ITWS": "C", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 6.37, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "B", "IDS": "D", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "B", "ES": "A" }, "status": "PASS", "sgpa": 7.33, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "B", "DBMS": "C", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "A", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.88, "credits": 21.0 } } },
    { "regno": "23K61A4411", "name": "Chinta Kalki Sri Sai Gangadhara Koushik", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "D", "CHEM": "E", "BCME": "E", "IP": "D", "CE_LAB": "C", "CHEM_LAB": "D", "C_LAB": "C", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.21, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "E", "EP": "E", "BEEE": "E", "EG": "D", "DS": "D", "EP_LAB": "D", "ITWS": "C", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 5.9, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "C", "IDS": "D", "ADS/AA": "D", "OOPJ": "D", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "C", "ES": "A" }, "status": "PASS", "sgpa": 6.7, "credits": 20.0 }, "sem4": { "subjects": { "OT": "E", "SMDS": "C", "DE": "B", "DBMS": "D", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.81, "credits": 21.0 } } },
    { "regno": "23K61A4412", "name": "Chintoju Harshitha", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "D", "CHEM": "D", "BCME": "C", "IP": "C", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 7.33, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "C", "BEEE": "B", "EG": "B", "DS": "C", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "A", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 8.12, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "A", "IDS": "B", "ADS/AA": "B", "OOPJ": "B", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "B", "ES": "S" }, "status": "PASS", "sgpa": 8.38, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "D", "DE": "A", "DBMS": "B", "DLCO": "B", "DE_LAB": "A", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.26, "credits": 21.0 } } },
    { "regno": "23K61A4413", "name": "Dhulipalla Divya", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "C", "CHEM": "C", "BCME": "D", "IP": "D", "CE_LAB": "B", "CHEM_LAB": "S", "C_LAB": "A", "EWS": "S", "SPORTS": "A" }, "status": "PASS", "sgpa": 7.44, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "S", "EP": "D", "BEEE": "C", "EG": "C", "DS": "C", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 7.63, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "B", "IDS": "B", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "S" }, "status": "PASS", "sgpa": 8.08, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "C", "DE": "S", "DBMS": "D", "DLCO": "C", "DE_LAB": "B", "DBMS_LAB": "D", "EDAP_LAB": "A", "DTI_LAB": "A" }, "status": "PASS", "sgpa": 7.67, "credits": 21.0 } } },
    { "regno": "23K61A4414", "name": "Dodda S A S V V D Pavan", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "E", "CHEM": "D", "BCME": "D", "IP": "D", "CE_LAB": "B", "CHEM_LAB": "C", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.54, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "D", "EG": "C", "DS": "C", "EP_LAB": "B", "ITWS": "A", "BEEE_LAB": "B", "DS_LAB": "B", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.05, "credits": 20.5 }, "sem3": { "subjects": { "UHV": "C", "IDS": "B", "ADS/AA": "C", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "A" }, "status": "PASS", "sgpa": 7.48, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "D", "DE": "B", "DBMS": "C", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.0, "credits": 21.0 } } },
    { "regno": "23K61A4415", "name": "Donga Lakshmi Jyothi", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "D", "CHEM": "D", "BCME": "D", "IP": "E", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.74, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "D", "EP": "C", "BEEE": "B", "EG": "B", "DS": "C", "EP_LAB": "B", "ITWS": "S", "BEEE_LAB": "S", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.61, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "B", "IDS": "A", "ADS/AA": "B", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "B", "PY_LAB": "A", "ES": "A" }, "status": "PASS", "sgpa": 8.33, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "C", "DE": "S", "DBMS": "B", "DLCO": "A", "DE_LAB": "S", "DBMS_LAB": "A", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.79, "credits": 21.0 } } },
    { "regno": "23K61A4416", "name": "Dusanapudi Rajeswari Rasagna", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "C", "CHEM": "D", "BCME": "C", "IP": "D", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.38, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "B", "EP": "D", "BEEE": "C", "EG": "C", "DS": "D", "EP_LAB": "A", "ITWS": "S", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.22, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "A", "IDS": "C", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "S" }, "status": "PASS", "sgpa": 7.7, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "B", "DLCO": "A", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.62, "credits": 21.0 } } },
    { "regno": "23K61A4417", "name": "Ghantasala Rambabu", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "A", "CHEM": "C", "BCME": "D", "IP": "C", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "A", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 7.67, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "S", "EP": "B", "BEEE": "C", "EG": "A", "DS": "D", "EP_LAB": "B", "ITWS": "A", "BEEE_LAB": "S", "DS_LAB": "S", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 8.37, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "C", "IDS": "C", "ADS/AA": "C", "OOPJ": "C", "IDS_LAB": "S", "OOPJ_LAB": "S", "PY_LAB": "A", "ES": "A" }, "status": "PASS", "sgpa": 7.9, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "C", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.19, "credits": 21.0 } } },
    { "regno": "23K61A4418", "name": "Gokanaboina G D Sai Lalitha", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "C", "CHEM": "E", "BCME": "C", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "B", "C_LAB": "B", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.03, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "D", "EG": "A", "DS": "D", "EP_LAB": "A", "ITWS": "S", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 7.2, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "B", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "C", "PY_LAB": "B", "ES": "A" }, "status": "PASS", "sgpa": 7.63, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "D", "DE": "A", "DBMS": "A", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.48, "credits": 21.0 } } },
    { "regno": "23K61A4419", "name": "Gullapalli Pavan", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "D", "LA&C": "D", "CHEM": "E", "BCME": "D", "IP": "F", "CE_LAB": "C", "CHEM_LAB": "C", "C_LAB": "C", "EWS": "A", "SPORTS": "A" }, "status": "FAIL", "sgpa": 0, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "D", "EP": "D", "BEEE": "E", "EG": "C", "DS": "C", "EP_LAB": "B", "ITWS": "D", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 6.54, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "C", "IDS": "C", "ADS/AA": "D", "OOPJ": "E", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "A" }, "status": "PASS", "sgpa": 6.95, "credits": 20.0 }, "sem4": { "subjects": { "OT": "E", "SMDS": "D", "DE": "C", "DBMS": "C", "DLCO": "C", "DE_LAB": "B", "DBMS_LAB": "C", "EDAP_LAB": "B", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.12, "credits": 21.0 } } },
    { "regno": "23K61A4420", "name": "Gunupudi Dhanasri", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "B", "CHEM": "C", "BCME": "B", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.87, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "B", "BEEE": "B", "EG": "B", "DS": "A", "EP_LAB": "C", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "B" }, "status": "PASS", "sgpa": 8.29, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "A", "UHV": "C", "IDS": "B", "ADS/AA": "B", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "S", "ES": "S" }, "status": "PASS", "sgpa": 8.05, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "B", "DE": "A", "DBMS": "A", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.62, "credits": 21.0 } } },
    { "regno": "23K61A4421", "name": "Isinigiri Harshitha", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "B", "CHEM": "B", "BCME": "C", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "B", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 7.74, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "B", "BEEE": "D", "EG": "B", "DS": "C", "EP_LAB": "C", "ITWS": "A", "BEEE_LAB": "S", "DS_LAB": "A", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 7.68, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "C", "IDS": "C", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "A", "OOPJ_LAB": "A", "PY_LAB": "S", "ES": "S" }, "status": "PASS", "sgpa": 7.6, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "B", "DE": "A", "DBMS": "B", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.48, "credits": 21.0 } } },
    { "regno": "23K61A4422", "name": "Jakka Syam Babu", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "B", "CHEM": "C", "BCME": "D", "IP": "D", "CE_LAB": "B", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.41, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "B", "BEEE": "C", "EG": "S", "DS": "B", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "S", "DS_LAB": "S", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 8.71, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "C", "IDS": "C", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 7.43, "credits": 20.0 }, "sem4": { "subjects": { "OT": "C", "SMDS": "B", "DE": "A", "DBMS": "A", "DLCO": "C", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.71, "credits": 21.0 } } },
    { "regno": "23K61A4423", "name": "Jannu Yuva Kiran", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "B", "CHEM": "E", "BCME": "E", "IP": "E", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "A", "EWS": "B", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.69, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "D", "EP": "D", "BEEE": "D", "EG": "B", "DS": "C", "EP_LAB": "C", "ITWS": "B", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 6.88, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "C", "IDS": "D", "ADS/AA": "C", "OOPJ": "F", "IDS_LAB": "S", "OOPJ_LAB": "C", "PY_LAB": "A", "ES": "A" }, "status": "FAIL", "sgpa": 0, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "D", "DE": "B", "DBMS": "D", "DLCO": "C", "DE_LAB": "A", "DBMS_LAB": "A", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 7.52, "credits": 21.0 } } },
    { "regno": "23K61A4424", "name": "Kadimi Sudheer Kumar", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "D", "LA&C": "E", "CHEM": "F", "BCME": "F", "IP": "F", "CE_LAB": "C", "CHEM_LAB": "D", "C_LAB": "C", "EWS": "S", "SPORTS": "B" }, "status": "FAIL", "sgpa": 0, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "D", "EP": "F", "BEEE": "F", "EG": "E", "DS": "F", "EP_LAB": "F", "ITWS": "B", "BEEE_LAB": "C", "DS_LAB": "D", "NCC/NSS": "B" }, "status": "FAIL", "sgpa": 0, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "E", "UHV": "E", "IDS": "D", "ADS/AA": "F", "OOPJ": "F", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "B", "ES": "C" }, "status": "FAIL", "sgpa": 0, "credits": 20.0 }, "sem4": { "subjects": { "OT": "F", "SMDS": "E", "DE": "D", "DBMS": "E", "DLCO": "F", "DE_LAB": "D", "DBMS_LAB": "D", "EDAP_LAB": "C", "DTI_LAB": "A" }, "status": "FAIL", "sgpa": 0, "credits": 21.0 } } },
    { "regno": "23K61A4425", "name": "Kambala Tejaswani Devi", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "C", "CHEM": "C", "BCME": "C", "IP": "D", "CE_LAB": "S", "CHEM_LAB": "B", "C_LAB": "A", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.56, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "C", "EG": "B", "DS": "D", "EP_LAB": "B", "ITWS": "S", "BEEE_LAB": "S", "DS_LAB": "B", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 7.41, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "D", "UHV": "A", "IDS": "B", "ADS/AA": "B", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "S", "ES": "S" }, "status": "PASS", "sgpa": 7.98, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "B", "DLCO": "S", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.67, "credits": 21.0 } } },
    { "regno": "23K61A4426", "name": "Kandipalli Srilakshmi Bhavani", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "B", "CHEM": "A", "BCME": "A", "IP": "D", "CE_LAB": "S", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 8.56, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "A", "EP": "C", "BEEE": "B", "EG": "A", "DS": "B", "EP_LAB": "B", "ITWS": "A", "BEEE_LAB": "S", "DS_LAB": "A", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 8.44, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "B", "ADS/AA": "B", "OOPJ": "A", "IDS_LAB": "B", "OOPJ_LAB": "B", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 8.18, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "B", "DE": "A", "DBMS": "B", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.62, "credits": 21.0 } } },
    { "regno": "23K61A4427", "name": "Karneedi Sai Sreehitha", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "B", "CHEM": "B", "BCME": "B", "IP": "B", "CE_LAB": "S", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "S", "SPORTS": "A" }, "status": "PASS", "sgpa": 8.59, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "S", "EP": "A", "BEEE": "B", "EG": "S", "DS": "C", "EP_LAB": "A", "ITWS": "S", "BEEE_LAB": "S", "DS_LAB": "A", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 9.0, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "B", "IDS": "A", "ADS/AA": "B", "OOPJ": "B", "IDS_LAB": "S", "OOPJ_LAB": "S", "PY_LAB": "S", "ES": "S" }, "status": "PASS", "sgpa": 8.5, "credits": 20.0 }, "sem4": { "subjects": { "OT": "A", "SMDS": "A", "DE": "S", "DBMS": "S", "DLCO": "A", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 9.62, "credits": 21.0 } } },
    { "regno": "23K61A4428", "name": "Karuturi Mahendra", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "D", "CHEM": "D", "BCME": "C", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "C", "EWS": "B", "SPORTS": "A" }, "status": "PASS", "sgpa": 6.87, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "D", "EG": "S", "DS": "C", "EP_LAB": "C", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "B", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.51, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "C", "IDS": "C", "ADS/AA": "C", "OOPJ": "C", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "A", "ES": "B" }, "status": "PASS", "sgpa": 7.5, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "C", "DE": "A", "DBMS": "A", "DLCO": "C", "DE_LAB": "B", "DBMS_LAB": "C", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.02, "credits": 21.0 } } },
    { "regno": "23K61A4429", "name": "Karuturi Naga Sai Vijay", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "E", "CHEM": "E", "BCME": "B", "IP": "E", "CE_LAB": "A", "CHEM_LAB": "C", "C_LAB": "B", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 6.69, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "D", "EG": "D", "DS": "D", "EP_LAB": "D", "ITWS": "A", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 6.66, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "E", "UHV": "C", "IDS": "D", "ADS/AA": "C", "OOPJ": "D", "IDS_LAB": "A", "OOPJ_LAB": "C", "PY_LAB": "B", "ES": "B" }, "status": "PASS", "sgpa": 6.65, "credits": 20.0 }, "sem4": { "subjects": { "OT": "E", "SMDS": "D", "DE": "A", "DBMS": "C", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "B", "EDAP_LAB": "A", "DTI_LAB": "A" }, "status": "PASS", "sgpa": 7.76, "credits": 21.0 } } },
    { "regno": "23K61A4430", "name": "Kati Bunny", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "C", "LA&C": "D", "CHEM": "E", "BCME": "B", "IP": "E", "CE_LAB": "A", "CHEM_LAB": "C", "C_LAB": "C", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 6.69, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "E", "BEEE": "D", "EG": "A", "DS": "C", "EP_LAB": "B", "ITWS": "B", "BEEE_LAB": "B", "DS_LAB": "C", "NCC/NSS": "C" }, "status": "PASS", "sgpa": 7.02, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "D", "UHV": "C", "IDS": "C", "ADS/AA": "C", "OOPJ": "C", "IDS_LAB": "A", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "A" }, "status": "PASS", "sgpa": 7.18, "credits": 20.0 }, "sem4": { "subjects": { "OT": "D", "SMDS": "B", "DE": "A", "DBMS": "C", "DLCO": "A", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.52, "credits": 21.0 } } },
    { "regno": "23K61A4431", "name": "Kolagani Thandava Sivakrishna", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "B", "CHEM": "C", "BCME": "D", "IP": "B", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "A", "SPORTS": "A" }, "status": "PASS", "sgpa": 7.9, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "E", "EG": "B", "DS": "D", "EP_LAB": "C", "ITWS": "A", "BEEE_LAB": "B", "DS_LAB": "S", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.0, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "D", "IDS": "D", "ADS/AA": "D", "OOPJ": "D", "IDS_LAB": "A", "OOPJ_LAB": "A", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 6.9, "credits": 20.0 }, "sem4": { "subjects": { "OT": "B", "SMDS": "D", "DE": "B", "DBMS": "B", "DLCO": "D", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.0, "credits": 21.0 } } },
    { "regno": "23K61A4432", "name": "Kunuku Swathi Tanuja", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "A", "LA&C": "B", "CHEM": "E", "BCME": "C", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "A", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.44, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "B", "EP": "B", "BEEE": "C", "EG": "S", "DS": "D", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "B", "DS_LAB": "B", "NCC/NSS": "S" }, "status": "PASS", "sgpa": 8.0, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "S", "UHV": "B", "IDS": "C", "ADS/AA": "B", "OOPJ": "D", "IDS_LAB": "A", "OOPJ_LAB": "A", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 8.1, "credits": 20.0 }, "sem4": { "subjects": { "OT": "A", "SMDS": "A", "DE": "B", "DBMS": "D", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "A", "EDAP_LAB": "A", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.45, "credits": 21.0 } } },
    { "regno": "23K61A4433", "name": "Madireddy Venkata Sai Narasimha Naidu", "gender": "M", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "A", "CHEM": "C", "BCME": "A", "IP": "C", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "S", "SPORTS": "B" }, "status": "PASS", "sgpa": 8.41, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "S", "EP": "B", "BEEE": "B", "EG": "B", "DS": "D", "EP_LAB": "A", "ITWS": "B", "BEEE_LAB": "A", "DS_LAB": "C", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 8.07, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "B", "UHV": "B", "IDS": "C", "ADS/AA": "B", "OOPJ": "D", "IDS_LAB": "S", "OOPJ_LAB": "B", "PY_LAB": "B", "ES": "S" }, "status": "PASS", "sgpa": 7.7, "credits": 20.0 }, "sem4": { "subjects": { "OT": "A", "SMDS": "B", "DE": "A", "DBMS": "C", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.76, "credits": 21.0 } } },
    { "regno": "23K61A4434", "name": "Mane Nikhitha", "gender": "F", "phone": "", "email": "", "semesters": { "sem1": { "subjects": { "CE": "B", "LA&C": "C", "CHEM": "D", "BCME": "C", "IP": "D", "CE_LAB": "A", "CHEM_LAB": "A", "C_LAB": "S", "EWS": "A", "SPORTS": "B" }, "status": "PASS", "sgpa": 7.41, "credits": 19.5 }, "sem2": { "subjects": { "DEVC": "C", "EP": "D", "BEEE": "B", "EG": "B", "DS": "C", "EP_LAB": "A", "ITWS": "A", "BEEE_LAB": "S", "DS_LAB": "B", "NCC/NSS": "A" }, "status": "PASS", "sgpa": 7.68, "credits": 20.5 }, "sem3": { "subjects": { "DMGT": "C", "UHV": "A", "IDS": "B", "ADS/AA": "C", "OOPJ": "B", "IDS_LAB": "S", "OOPJ_LAB": "A", "PY_LAB": "A", "ES": "S" }, "status": "PASS", "sgpa": 8.0, "credits": 20.0 }, "sem4": { "subjects": { "OT": "A", "SMDS": "A", "DE": "A", "DBMS": "D", "DLCO": "B", "DE_LAB": "S", "DBMS_LAB": "S", "EDAP_LAB": "S", "DTI_LAB": "S" }, "status": "PASS", "sgpa": 8.76, "credits": 21.0 } } },
    {
        "regno": "23K61A4435",
        "name": "Menthey Manideep Sai",
        "gender": "M",
        "phone": "",
        "email": "",
        "semesters": {
            "sem1": {
                "subjects": {
                    "CE": "D",
                    "LA&C": "F",
                    "CHEM": "E",
                    "BCME": "D",
                    "IP": "F",
                    "CE_LAB": "A",
                    "CHEM_LAB": "B",
                    "C_LAB": "D",
                    "EWS": "S",
                    "SPORTS": "B"
                },
                "status": "FAIL",
                "sgpa": 0,
                "credits": 19.5
            },
            "sem2": {
                "subjects": {
                    "DEVC": "E",
                    "EP": "E",
                    "BEEE": "D",
                    "EG": "C",
                    "DS": "E",
                    "EP_LAB": "B",
                    "ITWS": "B",
                    "BEEE_LAB": "C",
                    "DS_LAB": "D",
                    "NCC/NSS": "B"
                },
                "status": "PASS",
                "sgpa": 6.02,
                "credits": 20.5
            },
            "sem3": {
                "subjects": {
                    "DMGT": "D",
                    "UHV": "E",
                    "IDS": "F",
                    "ADS/AA": "F",
                    "OOPJ": "F",
                    "IDS_LAB": "B",
                    "OOPJ_LAB": "D",
                    "PY_LAB": "B",
                    "ES": "B"
                },
                "status": "FAIL",
                "sgpa": 0,
                "credits": 20.0
            },
            "sem4": {
                "subjects": {
                    "OT": "F",
                    "SMDS": "E",
                    "DE": "E",
                    "DBMS": "F",
                    "DLCO": "E",
                    "DE_LAB": "B",
                    "DBMS_LAB": "D",
                    "EDAP_LAB": "B",
                    "DTI_LAB": "A"
                },
                "status": "FAIL",
                "sgpa": 0,
                "credits": 21.0
            }
        }
    },

    {
        "regno": "23K61A4436",
        "name": "Mokhamatla Bhavani Prasad",
        "gender": "M",
        "phone": "",
        "email": "",
        "semesters": {
            "sem1": {
                "subjects": {
                    "CE": "B",
                    "LA&C": "D",
                    "CHEM": "D",
                    "BCME": "B",
                    "IP": "D",
                    "CE_LAB": "B",
                    "CHEM_LAB": "A",
                    "C_LAB": "B",
                    "EWS": "S",
                    "SPORTS": "B"
                },
                "status": "PASS",
                "sgpa": 7.28,
                "credits": 19.5
            },
            "sem2": {
                "subjects": {
                    "DEVC": "B",
                    "EP": "C",
                    "BEEE": "B",
                    "EG": "D",
                    "DS": "D",
                    "EP_LAB": "B",
                    "ITWS": "S",
                    "BEEE_LAB": "B",
                    "DS_LAB": "B",
                    "NCC/NSS": "B"
                },
                "status": "PASS",
                "sgpa": 7.37,
                "credits": 20.5
            },
            "sem3": {
                "subjects": {
                    "DMGT": "B",
                    "UHV": "A",
                    "IDS": "B",
                    "ADS/AA": "B",
                    "OOPJ": "C",
                    "IDS_LAB": "S",
                    "OOPJ_LAB": "A",
                    "PY_LAB": "A",
                    "ES": "S"
                },
                "status": "PASS",
                "sgpa": 8.3,
                "credits": 20.0
            },
            "sem4": {
                "subjects": {
                    "OT": "B",
                    "SMDS": "B",
                    "DE": "A",
                    "DBMS": "C",
                    "DLCO": "C",
                    "DE_LAB": "S",
                    "DBMS_LAB": "S",
                    "EDAP_LAB": "S",
                    "DTI_LAB": "S"
                },
                "status": "PASS",
                "sgpa": 8.52,
                "credits": 21.0
            }
        }
    }


];
