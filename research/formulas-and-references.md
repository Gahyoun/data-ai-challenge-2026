# 아이디어별 수식과 참고문헌

확인일: 2026-09-14 · 기존 6개 후보 + 돌봄·복지 확장안

각 수식은 연구 설계의 기준선 또는 적용식이다. 논문이 지지하는 범위와 이번 연구가 추가하는 가정을 구분했다. 실제 지역 분석·ABM 결과가 아니며, 최적화식 자체가 통계물리 법칙이라는 뜻도 아니다.

**현재 개선 범위:** 기존 시설의 위치를 고정한 수용량·운영시간·인력·이동 연결 개선. 기후쉼터의 연속 시설밀도 2/3 식은 이론 비교용이며 신규 건설 계획이나 추가 정원의 배분 법칙이 아니다. 청소년의 0.6 ≤ α < 1은 사용자 지정 시나리오다.

[웹에서 보기](https://gahyoun.github.io/data-ai-challenge-2026/#methods) · [원본 JSON](../data/methods.json)

## 1. 경사·단절을 고려한 생활권 순찰 접근망

**확률보행 · 최초 도달시간 · 최대 커버링**

방향별 경사·통행·에너지 제약을 반영한 도로망에서 무작위 순찰을 기준선으로 두고, 기존 거점에 자원을 배정했을 때의 도달 공백을 비교합니다.

### 확률보행의 평균 최초 도달시간

$$
h_i=1+\sum_j P_{ij}h_j\quad(i\ne a),\qquad h_a=0
$$

Pᵢⱼ는 허용된 링크의 이동확률, hᵢ는 노드 i에서 목표 a를 처음 만날 때까지의 평균 이동 횟수입니다. 각 행의 확률 합은 1입니다.

**적용 범위:** Masuda et al.의 확률보행 이론을 순찰 기준선에 적용합니다. h는 초 단위 응답시간이 아닙니다. 목표 도달 확률이 1이고 평균이 유한한 경우에 사용하며, 도달 불가능 상태는 ∞로 남깁니다. 배터리를 넣으면 위치뿐 아니라 잔량을 포함한 상태망이 필요합니다.

### 기존 거점의 제한된 자원으로 도달 인구 최대화

$$
\max_{y,z}\sum_i n_i z_i,\quad z_i\le\sum_{j\in N_i(\tau)}y_j,\quad\sum_j y_j\le p,\quad y_j,z_i\in\{0,1\}
$$

nᵢ는 출발지 인구, yⱼ는 기존 거점 j의 자원 운영 여부, p는 운영할 거점 수입니다. Nᵢ(τ)는 합법·물리적으로 가능한 경로로 τ 이내에 i에 도달할 수 있는 거점 집합입니다.

**적용 범위:** Church & ReVelle의 최대 커버링 모형을 기존 거점에 적용합니다. 이는 운영연구의 최적화식이며 통계물리 법칙 자체는 아닙니다. 다중 출동·대기·재충전 경쟁은 별도 제약/ABM이 필요합니다.

**비교 실험과 해석:** 같은 수의 운영 거점과 자원으로 현행 배정·인구 비례·허용 거점 내 무작위 배정을 비교합니다. 경사·에너지 제약을 하나씩 제외해 효과를 분해하며, 확률보행은 정책 후보의 최적 경로와 구분합니다. 도달률 개선을 범죄 감소로 해석하지 않습니다.

### 참고문헌

- Naoki Masuda; Mason A. Porter; Renaud Lambiotte (2017). [Random walks and diffusion on networks](https://arxiv.org/abs/1612.03281). *Physics Reports 716–717, 1–58*. DOI: [10.1016/j.physrep.2017.07.007](https://doi.org/10.1016/j.physrep.2017.07.007). 네트워크 확률보행·최초 도달시간의 이론과 적용 범위를 정리한 리뷰. 순찰봇의 성능이나 치안 효과를 검증한 논문은 아닙니다.
- Richard Church; Charles ReVelle (1974). [The maximal covering location problem](https://people.geog.ucsb.edu/~forest/G294download/MAX_COVER_RLC_CSR.pdf). *Papers of the Regional Science Association 32, 101–118*. DOI: [10.1007/BF01942293](https://doi.org/10.1007/BF01942293). 거리·시간 한도 내 수요를 제한된 시설 수로 최대한 덮는 고전적 최적화 모형. 여기서는 기존 거점 운영·자원 배정으로 적용합니다.

## 2. 고령인구·경사를 반영한 기후쉼터 배치

**공간 스케일링 · 이동성의 이질성 · 정원 경쟁 ABM**

평균 이동시간 최소화의 2/3 기준선에서 출발해, 실제 보행망·개인차·정원·운영시간 때문에 생기는 차이를 검증합니다. 실제 개선안은 기존 시설의 확충·운영·이동 지원을 비교합니다.

### 집단별 이동 부담을 합친 유효 밀도

$$
q(x)=\sum_g\rho_g(x)\,\mathbb E_g[1/v\mid x]
$$

ρg는 집단 g의 인구밀도, v는 이동속도입니다. 느린 사람의 부담을 반영하려면 평균속도의 역수 대신 역속도의 평균을 사용합니다.

**적용 범위:** 이번 연구의 이질적 속도 확장식입니다. v>0이고 역속도 평균이 유한하며, 지역 내 속도와 이동거리의 조건부 독립을 가정합니다. 보행 불가능 집단은 별도 이동 지원 수요로 남깁니다.

### 평균 이동시간을 줄이는 연속 시설밀도 기준선

$$
s^*(x)=\frac{Kq(x)^{2/3}}{\int_\Omega q(u)^{2/3}\,du}
$$

s*는 단위면적당 시설 수, K는 고정된 전체 시설 수입니다. 같은 속도라면 s*∝ρ^(2/3)로 돌아갑니다.

**적용 범위:** Gastner & Newman의 2차원 거리 최소화 기준선에 위 속도 가정을 결합했습니다. 연속 공간·같은 비용·무한 정원·상시 개방의 근사이며, 기존 시설의 추가 수용량이나 청소년 α를 결정하는 법칙은 아닙니다.

**비교 실험과 해석:** 이론식은 비교용으로 두고, 기존 위치를 고정한 정원·운영시간·보행 지원 개선안을 같은 예산에서 비교합니다. 동일 속도 → 집단별 분포 → 경사 → 정원 경쟁을 순서대로 추가하고, 충족률·미도달 인구·대기시간을 측정합니다. 지역의 로그–로그 직선만으로 보편 지수를 주장하지 않습니다.

### 참고문헌

- Michael T. Gastner; M. E. J. Newman (2006). [Optimal design of spatial distribution networks](https://arxiv.org/abs/cond-mat/0603278). *Physical Review E 74, 016117*. DOI: [10.1103/PhysRevE.74.016117](https://doi.org/10.1103/PhysRevE.74.016117). 2차원 평균 최근접 거리 최소화의 시설밀도 2/3 관계. 고령자·기후·수용량과 이질적 속도 q는 이번 연구에서 추가하는 가정입니다.
- Yanyan Xu; Luis E. Olmos; Sofiane Abbar; Marta C. González (2020). [Deconstructing laws of accessibility and facility distribution in cities](https://humnetlab.berkeley.edu/wp-content/uploads/2021/03/Deconstructing-laws-of-accessibility-and-facility-distribution-in-cities.pdf). *Science Advances 6(37), eabb4112*. DOI: [10.1126/sciadv.abb4112](https://doi.org/10.1126/sciadv.abb4112). 도시 내부에서 2/3 관계가 일반적으로 성립하지 않으며 시설 수와 거주 블록 수에 따라 달라짐을 보입니다. 실제 용량 확충에 지수를 강제하지 않을 근거입니다.

## 3. 침수 한 구간이 끊는 생활권

**공간 상관 단절과 서비스 접근성 견고성**

침수 간선을 제거한 유향 도로망에서 서비스 도달 인구의 손실을 측정한다. 최대 연결성분은 보조 지표로 두고, 같은 예산의 구간 보강으로 회복되는 접근성을 비교한다.

### 서비스 도달률 — 본 프로젝트의 인구 가중 적용식

$$
C_s(q;\tau)=\frac{\sum_i P_i\,\mathbf{1}\{\min_{j\in F_s(q)}T_{ij}(G_q)\leq\tau\}}{\sum_i P_i}
$$

q는 주어진 침수 시나리오 계열의 단절 간선 비율, G_q는 남은 유향망, P_i는 출발지 인구, F_s(q)는 해당 시나리오에서 이용 가능한 서비스 s 시설 집합, T_ij는 이동시간, τ는 정책적 도달시간 한도. 경로 또는 시설이 없으면 최솟값은 ∞.

**적용 범위:** 시설 정원 경쟁까지 보장하는 이용률은 아니며, 정원·개방시간을 넣은 배정 결과로 후속 확장한다. 논문의 수식을 그대로 복사한 것이 아니라 지역 서비스 평가용 적용식이다.

### 구조 보조 지표

$$
P_{\infty}(q)=\frac{|V_{\mathrm{largest}}(G_q)|}{|V|}
$$

원래 노드 수를 분모로 고정한다. 유향망에서는 강연결·약연결을 명시하고 따로 보고하며, 실제 서비스까지의 방향별 경로 존재 여부를 별도 계산한다.

**적용 범위:** Wang et al.의 퍼콜레이션 질서변수에 해당하는 기준선. 원 논문의 노드 고장을 본 연구의 간선 고장으로 바꾸므로 적용 차이를 표시한다. P∞의 급감만으로 지역 주민의 서비스 이용 불가나 보편적 임계지수를 확정하지 않는다.

**비교 실험과 해석:** 같은 단절 간선 수·총길이·도로등급을 맞춘 무작위 대조와 공간 군집 대조를 병행한다. 강·수위·고도에 따른 공간 상관을 지우지 않는다. 국소홍수는 도로망 전체를 무너뜨리지 않아도 지역 서비스를 차단할 수 있으므로 분석 경계와 P∞에만 의존하지 않는다. 고가도로·지하차도·지표고를 구분한다.

### 참고문헌

- Weiping Wang, Saini Yang, H. Eugene Stanley, Jianxi Gao (2019). [Local floods induce large-scale abrupt failures of road networks](https://www.nature.com/articles/s41467-019-10063-w). *Nature Communications 10, 2114*. DOI: [10.1038/s41467-019-10063-w](https://doi.org/10.1038/s41467-019-10063-w). 고도와 홍수 전파를 결합한 도로망 고장모형, 무작위·국소 고장과의 비교, 최대 연결성분 비율 P∞의 선례. 본 연구와 달리 노드 고장과 giant component 밖 노드의 간접 실패를 정의한다. 한국 생활권 서비스 손실을 검증한 논문은 아니다.
- Simone Loreti, Enrico Ser-Giacomi, Andreas Zischg, Margreth Keiler, Marc Barthelemy (2022). [Local impacts on road networks and access to critical locations during extreme floods](https://www.nature.com/articles/s41598-022-04927-3). *Scientific Reports 12, 1552*. DOI: [10.1038/s41598-022-04927-3](https://doi.org/10.1038/s41598-022-04927-3). 현실적 홍수에서 giant component의 한계를 직접 보이고, 서비스 거점으로의 접근·재경로·유입권 변화에 초점을 둔다. 국소 홍수에서 전체 연결성분은 분석 경계에 영향을 받고 실제 지역 서비스 손실을 가릴 수 있다. 퍼콜레이션이 항상 최선의 성능 지표라는 주장을 피할 근거.

## 4. 학생은 줄어도 통학 공백은 남는다

**수요–시설 이분망 · 정원 경쟁 · 제약된 null model**

시간·자격에 맞는 학교/돌봄만 연결한 이분망에서 수요 대비 수용량을 측정하고, 같은 연결 수·공급·수요를 유지한 기준망과 비교한다.

### 경쟁을 반영한 접근성 기준선 (2SFCA 적용)

$$
R_j=\frac{C_j}{\sum_{i:a_{ij}=1} n_i},\qquad A_i=\sum_{j:a_{ij}=1}R_j
$$

n_i: 같은 시간창의 출발지 학령 수요, C_j: 같은 서비스·시간 단위의 정원, a_ij: 통학시간·자격·운영시간을 만족할 때 1. 갈 수 있는 시설 수만 세지 않고, 그 시설을 두고 경쟁하는 주변 수요를 공급량의 분모에 넣는다.

**적용 범위:** Luo & Wang의 의료 공급–수요 접근성 방법을 학교/돌봄 이분망에 적용하는 제안. 저자들이 한국 학교 문제를 검증했다는 뜻은 아니다. 분모가 0인 시설은 수요 접근성 합산에서 제외. A_i는 접근 가능한 공급/수요 비율이지 이용 확률이나 0~1 충족률이 아니다. 실제 정원 초과 방지는 별도 배정식으로 수행.

### 정원을 넘기지 않는 충족 수요 배정

$$
M=\max_{z\in\mathbb Z_{\ge0}}\sum_{ij}z_{ij},\quad \sum_jz_{ij}\le n_i,\quad \sum_iz_{ij}\le C_j,\quad z_{ij}\le n_i a_{ij}
$$

z_ij: 출발지 i에서 시설 j로 배정되는 인원. M/Σ_i n_i는 해당 시나리오의 최대 충족률. 기존 시설의 정원·운영시간 또는 통학 연결을 개선했을 때 M이 얼마나 증가하는지 비교한다.

**적용 범위:** 본 프로젝트의 수요–공급 이분망 배정식. 이 정수계획 자체를 통계물리 법칙으로 부르지 않는다. 시설별 프로그램/시간이 다르면 별도 자원 제약이 필요. n_i는 재학생 수에서 거주지를 추정한 값이 아니다. 인원 단위는 정수, 집계 수요의 연속 근사라면 이를 따로 표시합니다.

**비교 실험과 해석:** 시설 위치·기존 용량·수요를 고정하고, 학교–수요 이분망의 차수를 보존하는 재연결을 대조군으로 검토한다. 실제 통학시간대·자격·공간 범위도 보존하는 허용 교환만 수행하며, 제약 때문에 섞이지 않으면 그 한계를 기록한다. Newman et al.의 일반 무작위 이분망을 지리적 통학망에 무제약으로 적용하지 않는다.

### 참고문헌

- Wei Luo; Fahui Wang (2003). [Measures of Spatial Accessibility to Health Care in a GIS Environment: Synthesis and a Case Study in the Chicago Region](https://doi.org/10.1068/b29120). *Environment and Planning B: Planning and Design 30(6), 865–884*. DOI: [10.1068/b29120](https://doi.org/10.1068/b29120). 이동시간 범위와 주변 수요 경쟁을 함께 고려하는 FCA/중력 접근성 기준. 학교 적용·정수 배정은 이번 연구의 확장.
- M. E. J. Newman; S. H. Strogatz; D. J. Watts (2001). [Random graphs with arbitrary degree distributions and their applications](https://doi.org/10.1103/PhysRevE.64.026118). *Physical Review E 64, 026118*. DOI: [10.1103/PhysRevE.64.026118](https://doi.org/10.1103/PhysRevE.64.026118). 임의 차수분포의 단일·유향·이분 무작위망 이론. 학교 접근성이 연결 수만으로 설명되는지 비교할 통계물리 null model의 기반.

## 5. 정류장 이후의 공백을 메우는 교통 연결

**시간의존 다층망 · 동기화 손실 · 용량제약 차량 배정**

보행–버스–DRT를 시간 순서가 맞는 다층망으로 연결하고, 배차·환승 때문에 생기는 손실과 운행 가능한 차량 배정을 분리해 측정한다.

### 시각표를 지키는 문앞–목적지 경로

$$
T_{ij}(t_0)=\min_{p\in\mathcal P_{ij}(t_0)}\{t_{\rm arrive}(p)-t_0\},\qquad C(\tau)=\frac{\sum_i n_i\mathbf1[\min_{j\in F_s} T_{ij}(t_0)\le\tau]}{\sum_i n_i}
$$

P_ij: 보행·정규버스·가상 DRT를 쓰며 출발·도착·환승 시각이 맞는 경로 집합, t₀: 출발시각, n_i: 출발지 수요. 보행, 첫 대기, 차내, 환승, 마지막 보행을 모두 계산한다. 경로가 없으면 T=∞로 두어 미도달 수요를 남긴다. F_s는 동일 서비스 s의 자격을 충족하는 목적지 집합입니다. 서비스별로 따로 계산하며 서로 다른 서비스를 대체하지 않습니다.

**적용 범위:** Gallotti & Barthelemy의 time-respecting 다층 교통망을 필수서비스 접근성에 적용하는 제안. 시간표는 운행 날짜와 일치해야 한다. DRT는 승객·차량 동시 배정 후 실제 제공되는 간선만 허용하며, 가상의 모든 호출 간선을 동시에 활성화하지 않는다.

### 시간표 동기화 손실 (프로젝트 비교지표)

$$
\delta_{ij}(t_0)=\frac{T_{ij}(t_0)-T^{\rm ideal}_{ij}}{T_{ij}(t_0)}
$$

T^ideal: 같은 보행·주행망에서 모든 환승이 즉시 연결된다고 가정한 시간 하한. δ는 도달 가능한 경로에만 정의. 노선은 연결되어 있어도 배차와 환승이 맞지 않아 생기는 시간 손실을 분리한다. 정류장 추가와 시간표 조정 중 병목에 맞는 개선을 찾는다.

**적용 범위:** 교통망의 최소시간과 시간순서 경로를 비교하는 Gallotti 연구 계열을 참고한 프로젝트 정의. 원문 방정식 번호를 그대로 옮긴 것은 아니다. 미도달 OD를 δ 평균에서 숨기지 말고 그 비율을 별도 보고. T^ideal>0, T≥T^ideal 조건을 검사. 일반 평균 속도 향상과 서비스 충족은 다른 결과다.

**비교 실험과 해석:** DRT 효과 평가에는 차량 정원, 최대 대기·우회시간, 차량 1대당 동시 수행 불가, 요청별 중복 배정 불가를 포함한다. 실제 호출자료가 없으면 가상 수요 시나리오로 표시한다. 같은 차량·운행시간·예산에서 현행 연결, 시간표 조정, DRT 연결을 비교하고 출발시간대별 미도달 수요를 따로 보고합니다.

### 참고문헌

- Riccardo Gallotti; Marc Barthelemy (2015). [The multilayer temporal network of public transport in Great Britain](https://www.nature.com/articles/sdata201456). *Scientific Data 2, 140056*. DOI: [10.1038/sdata.2014.56](https://doi.org/10.1038/sdata.2014.56). 교통수단별 층, 보행 환승 간선, 출발·도착 이벤트, time-respecting 최단경로의 데이터 구조.
- Javier Alonso-Mora; Samitha Samaranayake; Alex Wallar; Emilio Frazzoli; Daniela Rus (2017). [On-demand high-capacity ride-sharing via dynamic trip-vehicle assignment](https://doi.org/10.1073/pnas.1611675114). *PNAS 114(3), 462–467*. DOI: [10.1073/pnas.1611675114](https://doi.org/10.1073/pnas.1611675114). 요청·합승 조합·차량의 동적 배정 선례. DRT 연결을 무한 정원 가상 링크로 취급하지 않을 근거. 한국 농촌의 효과나 수요를 검증한 연구는 아니다.

## 6. 고속도로 병목의 지역도로 전파

**속도 임계값 퍼콜레이션과 혼잡 군집**

링크별 상대속도로 기능 가능한 도로망을 만들고, 큰 연결성분이 분절되는 시간·임계값을 추적한다. 반대로 혼잡 링크만 묶은 군집의 개수·크기를 교통량 변화와 함께 비교한다.

### 동적 기능망

$$
r_e(t)=v_e(t)/v_e^{\mathrm{ref}},\qquad E_\theta(t)=\{e:r_e(t)>\theta\}
$$

v_e는 링크 속도, v_e^ref는 고정된 기준 속도, θ는 분석용 상대속도 임계값. 기준 속도는 과거 학습 구간에서만 산정하고 미래값을 쓰지 않는다.

**적용 범위:** Li et al.의 상대속도에 따른 기능망 필터링을 적용한다. 낮은 상대속도 링크를 분석에서 제외하는 것이며 실제 도로 폐쇄를 의미하지 않는다.

### 분절의 유한망 진단

$$
S_k(\theta,t)=|V_{C_k}(G_\theta(t))|/|V|,\qquad \theta^*(t)=\arg\max_\theta S_2(\theta,t)
$$

C_1·C_2는 첫째·둘째 큰 연결성분이다. θ를 스캔해 S_1의 분절과 S_2의 봉우리를 본다. 동률 처리와 임계값 간격을 고정한다.

**적용 범위:** 두 번째 성분의 최대점은 유한한 관측망에서의 진단값이다. 무한계 임계점이나 보편적 임계지수를 검증했다는 뜻은 아니다. 강연결·약연결 정의를 명시하고 고속도로의 일방통행을 서비스 경로 계산에서 보존한다.

**비교 실험과 해석:** 동일 요일·시간대 비사건일과 링크별 일주기를 보존한 시간 이동 대조군을 사용한다. 사건 단위로 보류 검증하고 결측·관측 지연을 확인한다. 군집의 동시 변화나 시간지연 상관은 인과적 전파의 증명이 아니며, 교통공학 기준선보다 앞선 경보인지 별도 검증한다.

### 참고문헌

- Daqing Li, Bowen Fu, Yunpeng Wang, Guangquan Lu, Yehiel Berezin, H. Eugene Stanley, Shlomo Havlin (2015). [Percolation transition in dynamical traffic network with evolving critical bottlenecks](https://doi.org/10.1073/pnas.1419185112). *Proceedings of the National Academy of Sciences 112(3), 669–672*. DOI: [10.1073/pnas.1419185112](https://doi.org/10.1073/pnas.1419185112). 상대속도 임계값에 따른 기능 도로망과 병목 탐색, 둘째 큰 연결성분 봉우리의 진단 선례. 원 논문 기준 속도는 관측 속도의 95백분위. 예측 적용에서는 해당 백분위를 미래 자료까지 포함해 산정하지 않는다. 온라인 공개일은 2014-12-31, 학술지 호 발행일은 2015-01-20이다.
- Lukas Ambühl, Monica Menendez, Marta C. González (2023). [Understanding congestion propagation by combining percolation theory with the macroscopic fundamental diagram](https://www.nature.com/articles/s42005-023-01144-w). *Communications Physics 6, 26*. DOI: [10.1038/s42005-023-01144-w](https://doi.org/10.1038/s42005-023-01144-w). 도시 교통 시뮬레이션에서 혼잡 군집 수와 거시적 교통량의 관계를 연결한 선례. 한국 IC–지역도로의 전파 효과나 경보 성능을 검증한 것은 아니다. 네트워크 연결성 지표를 곧바로 교통 유량 또는 이용자 접근성으로 해석하지 않는다.

## 7. 수요층별 돌봄·복지시설 확충과 접근성 개선

**이질적 다층 접근망 · 기존 용량 확충 · 개선 간 상호작용**

유소년·청소년·노년층의 서로 다른 허용 경로와 서비스 수요를 분리하고, 기존 시설의 수용량·시간·보행·교통 연결을 같은 예산에서 개선한다.

### 기존 시설의 추가 수용량 스케일링 기준선

$$
\Delta C_j=\min\{U_j,H_j,\lambda(U_j/U_{\rm ref})^{\alpha}\},\quad U_j=\max(D_j-C_j^0,0),\quad 0.6\le\alpha<1
$$

D_j: 자격·경로·시간을 충족해 중복 없이 배정한 수요, C_j⁰: 기존 수용량, U_j: 미충족 수요, H_j: 물리·인력 확충 상한. λ는 같은 단가의 총 추가용량 예산에 맞춘다. 청소년 상담센터·공공열람실·청소년문화체험센터에 각각 적용하는 비교 기준. 상한에 걸리지 않는 시설 사이에서 α<1은 수요 비례 배분보다 추가 배분 격차를 완화한다. U_ref>0은 서비스별로 고정하는 기준 수요 단위다.

**적용 범위:** 사용자 지정 시나리오와 본 연구의 배분식이다. 인용 논문이 0.6≤α<1을 입증하지 않는다. 시설밀도 2/3 법칙의 유도식이 아니다. 시설 위치 고정. 총량은 기존 C⁰+추가 ΔC이므로 최종 전체용량∝U^α가 아니다. 상한 도달 시 남은 예산을 재분배/기록한다. 서비스별 단위·예산을 분리하며 실제 이용정원 경쟁은 재배정해 계산.

### 보행 개선 × 정원 확대의 상호작용

$$
I_{WC}=F(W,C)-F(W,0)-F(0,C)+F(0,0)
$$

F: 같은 수요·시각의 충족 인원, W: 지정된 보행/교통 연결 개선, C: 지정된 기존시설 수용량 확대. 0은 해당 개선 없음. I>0이면 두 개선을 결합한 추가 효과가 각각의 효과 합보다 크다. 경로와 용량이 동시에 병목인지를 검증하는 복잡계 가설.

**적용 범위:** 결합망에서 흐름·혼잡에 따라 성능이 달라질 수 있다는 Morris & Barthelemy를 참고한 이 연구의 2×2 실험 관측량. 원문 공식의 인용도, 이미 관측된 돌봄 효과도 아니다. I는 인과적 현장 효과가 아니라 설정한 모형의 상호작용이다. 네 경우의 같은 수요/행동 난수와 제약을 유지한다. W+C는 비용이 더 들므로 최종 우선순위는 별도로 같은 예산 조합끼리 비교.

**비교 실험과 해석:** ABM은 정원 경쟁·대기·재예약·보호자 일정 충돌을 구현할 때 도입. 허용 경로+정적 배정만으로 충분한 MVP는 그 모델로 시작한다. 통계물리 부분은 집단별 유효망·결합 효과·제약을 제거한 대조군과 응답 곡선이며, 거듭제곱 선택이나 최적화 알고리즘 사용만으로 보편 스케일링을 입증하지 않는다.

### 참고문헌

- Richard G. Morris; Marc Barthelemy (2012). [Transport on Coupled Spatial Networks](https://doi.org/10.1103/PhysRevLett.109.128703). *Physical Review Letters 109, 128703*. DOI: [10.1103/PhysRevLett.109.128703](https://doi.org/10.1103/PhysRevLett.109.128703). 결합의 효과가 출발·도착 분포와 경로배정·혼잡에 좌우되는 공간 네트워크 선례. 교통·시설의 공동 병목 실험에 연결하는 제안이며 복지시설 α 범위의 근거는 아니다.
- Riccardo Gallotti; Marc Barthelemy (2015). [The multilayer temporal network of public transport in Great Britain](https://www.nature.com/articles/sdata201456). *Scientific Data 2, 140056*. DOI: [10.1038/sdata.2014.56](https://doi.org/10.1038/sdata.2014.56). 보행–대중교통을 시각표와 층간 연결로 표현하는 방법. 돌봄의 귀가·서비스 시간·픽업 정원·개인차 제약은 이 프로젝트가 추가해야 할 항목.
